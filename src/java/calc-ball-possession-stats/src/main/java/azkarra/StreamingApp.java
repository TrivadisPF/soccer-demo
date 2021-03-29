/*
 * Copyright 2019-2021 StreamThoughts.
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package azkarra;

import com.trivadis.demo.soccer.BallPossessionStatsEventV1;
import com.trivadis.demo.soccer.BallPossessionEventV1;
import com.trivadis.demo.soccer.GameStartEventV1;
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig;
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde;
import io.streamthoughts.azkarra.api.annotations.Component;
import io.streamthoughts.azkarra.api.config.Conf;
import io.streamthoughts.azkarra.api.config.Configurable;
import io.streamthoughts.azkarra.api.streams.TopologyProvider;
import io.streamthoughts.azkarra.streams.AzkarraApplication;
import io.streamthoughts.azkarra.streams.autoconfigure.annotations.AzkarraStreamsApplication;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.ValueTransformer;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.StoreBuilder;
import org.apache.kafka.streams.state.Stores;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


/**
 * Skeleton for a Azkarra Streams Application
 *
 * <p>For a tutorial how to write a Azkarra Streams application, check the
 * tutorials and examples on the <a href="https://www.azkarrastreams.io/docs/">Azkarra Website</a>.
 * </p>
 */
@AzkarraStreamsApplication
public class StreamingApp {

    public static void main(final String[] args) {
        AzkarraApplication.run(StreamingApp.class, args);
    }

    private static <VT extends SpecificRecord> SpecificAvroSerde<VT> createSerde(String schemaRegistryUrl) {
        SpecificAvroSerde<VT> serde = new SpecificAvroSerde<>();
        Map<String, String> serdeConfig = Collections
                .singletonMap(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl);
        serde.configure(serdeConfig, false);
        return serde;
    }

    @Component
    public static class BallPossessionStatsTopologyProvider implements TopologyProvider, Configurable {

        private String topicSource;
        private String gameStartTopicSource;
        private String topicSink;
        private String stateStoreName;
        private String schemaRegistryUrl;

        @Override
        public void configure(final Conf conf) {
            gameStartTopicSource = conf.getOptionalString("topic.source.game.start")
                    .orElse("game_start_event_v1");
            topicSource = conf.getOptionalString("topic.source")
                    .orElse("ball_possession_event_v1");
            topicSink = conf.getOptionalString("topic.sink")
                    .orElse("ball_possession_stats_event_v1");
            stateStoreName = conf.getOptionalString("state.store.name")
                    .orElse("count");
            schemaRegistryUrl = conf.getOptionalString("streams.schema.registry.url").orElse("must-be-defined-in-conf");
        }

        @Override
        public String version() {
            return Version.getVersion();
        }

        @Override
        public Topology topology() {
            final SpecificAvroSerde<BallPossessionEventV1> ballPossessionSerde = createSerde(schemaRegistryUrl);
            final SpecificAvroSerde<BallPossessionStatsEventV1> ballPossessionStatsSerde = createSerde(schemaRegistryUrl);

            final StreamsBuilder builder = new StreamsBuilder();

            final StoreBuilder<KeyValueStore<Integer, BallPossessionEventV1>> ballPossessionStore = Stores
                    .keyValueStoreBuilder(Stores.persistentKeyValueStore("BallPossesionStore"), Serdes.Integer(), ballPossessionSerde)
                    .withCachingEnabled();
            builder.addStateStore(ballPossessionStore);

            final StoreBuilder<KeyValueStore<Integer, BallPossessionStatsEventV1>> ballPossessionStatsStore = Stores
                    .keyValueStoreBuilder(Stores.persistentKeyValueStore("BallPossesionStatsStore"), Serdes.Integer(), ballPossessionStatsSerde)
                    .withCachingEnabled();
            builder.addStateStore(ballPossessionStatsStore);

            final BallPossessionStatisticsHandler ballPossessionStatisticsHandler =  new BallPossessionStatisticsHandler(ballPossessionStore.name(), ballPossessionStatsStore.name());

            final KStream<String, GameStartEventV1> gameStartEvent = builder.stream(gameStartTopicSource);
            gameStartEvent.foreach((k,v) -> ballPossessionStatisticsHandler.startGame((v.getMatchId())));

            final KStream<String, BallPossessionEventV1> source = builder.stream(topicSource);
            source.peek((k,v) -> System.out.println("================> " + v.toString()));

            KStream<String, BallPossessionStatsEventV1> ballPossessionStats = source.transformValues(() -> ballPossessionStatisticsHandler, ballPossessionStore.name(), ballPossessionStatsStore.name());
            ballPossessionStats.peek((k,v) -> System.out.println("================> " + v.toString()));

            ballPossessionStats.to(topicSink);

            return builder.build();
        }
    }

    private static final class BallPossessionStatisticsHandler implements ValueTransformer<BallPossessionEventV1, BallPossessionStatsEventV1> {
        final private String storeName;
        final private String statsStoreName;
        private KeyValueStore<Integer, BallPossessionEventV1> stateStore;
        private KeyValueStore<Integer, BallPossessionStatsEventV1> statsStateStore;
        private ProcessorContext context;

        public BallPossessionStatisticsHandler(final String storeName, final String statsStoreName) {
            Objects.requireNonNull(storeName,"Store Name can't be null");
            Objects.requireNonNull(statsStoreName,"Store Name can't be null");
            this.storeName = storeName;
            this.statsStoreName = statsStoreName;
        }

        public void startGame(final int matchId) {
            stateStore.delete(matchId);
            statsStateStore.delete(matchId);
        }

        @SuppressWarnings("unchecked")
        @Override
        public void init(ProcessorContext context) {
            this.context = context;
            stateStore = (KeyValueStore<Integer, BallPossessionEventV1>) this.context.getStateStore(storeName);
            statsStateStore = (KeyValueStore<Integer, BallPossessionStatsEventV1>) this.context.getStateStore(statsStoreName);
        }

        @Override
        public BallPossessionStatsEventV1 transform(BallPossessionEventV1 ballPossessionEvent) {
            long ballPossessionMs = 0;

            BallPossessionEventV1 prevBallPossessionEvent = stateStore.get(ballPossessionEvent.getMATCHID());
            stateStore.put(ballPossessionEvent.getMATCHID(), ballPossessionEvent);

            BallPossessionStatsEventV1 currentBallPossessionStats = statsStateStore.get(ballPossessionEvent.getMATCHID());
            if (currentBallPossessionStats == null) {
                currentBallPossessionStats = BallPossessionStatsEventV1.newBuilder().setMatchId(ballPossessionEvent.getMATCHID())
                        .setAwayTeamDurationMs(0l)
                        .setHomeTeamDurationMs(0l)
                        .setHomeTeamPercentage(0d)
                        .setAwayTeamPercentage(0d)
                        .setPlayersDurationsMs(new HashMap<>())
                        .setPlayersPercentages(new HashMap<>())
                        .build();
            }

            if (prevBallPossessionEvent != null) {
                ballPossessionMs = ballPossessionEvent.getTS() - prevBallPossessionEvent.getTS();
                if (prevBallPossessionEvent.getOBJECTTYPE() == 1) {
                    currentBallPossessionStats.setHomeTeamDurationMs(currentBallPossessionStats.getHomeTeamDurationMs() + ballPossessionMs);
                } else {
                    currentBallPossessionStats.setAwayTeamDurationMs(currentBallPossessionStats.getAwayTeamDurationMs() + ballPossessionMs);
                }
            }

            double total = currentBallPossessionStats.getHomeTeamDurationMs() + currentBallPossessionStats.getAwayTeamDurationMs();
            currentBallPossessionStats.setHomeTeamPercentage(currentBallPossessionStats.getHomeTeamDurationMs() / total * 100);
            currentBallPossessionStats.setAwayTeamPercentage(currentBallPossessionStats.getAwayTeamDurationMs() / total * 100);

            if (prevBallPossessionEvent != null) {
                CharSequence playerId = prevBallPossessionEvent.getPLAYERID().toString();
                if (!currentBallPossessionStats.getPlayersDurationsMs().containsKey(playerId)) {
                    currentBallPossessionStats.getPlayersDurationsMs().put(playerId, 0l);
                }
                long playerBallPossessionMs = currentBallPossessionStats.getPlayersDurationsMs().get(playerId) + ballPossessionMs;
                currentBallPossessionStats.getPlayersDurationsMs().put(playerId, playerBallPossessionMs);
                for (CharSequence pid : currentBallPossessionStats.getPlayersDurationsMs().keySet()) {
                    currentBallPossessionStats.getPlayersPercentages().put(pid, currentBallPossessionStats.getPlayersDurationsMs().get(pid)  / total * 100);
                }
            }

            statsStateStore.put(ballPossessionEvent.getMATCHID(), currentBallPossessionStats);
            return currentBallPossessionStats;
        }

        @Override
        public void close() {
            // TODO Auto-generated method stub

        }

    }

}