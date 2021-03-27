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

import com.trivadis.demo.soccer.BallPossessionStatsV1;
import com.trivadis.demo.soccer.BallPossessionEventV1;
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
        private String topicSink;
        private String stateStoreName;
        private String schemaRegistryUrl;

        @Override
        public void configure(final Conf conf) {
            topicSource = conf.getOptionalString("topic.source")
                    .orElse("ball_possession_event_v1");
            topicSink = conf.getOptionalString("topic.sink")
                    .orElse("ball_possession_stats_v1");
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
            final SpecificAvroSerde<BallPossessionStatsV1> ballPossessionStatsSerde = createSerde(schemaRegistryUrl);

            final StreamsBuilder builder = new StreamsBuilder();

            final StoreBuilder<KeyValueStore<Long, BallPossessionEventV1>> ballPossessionStore = Stores
                    .keyValueStoreBuilder(Stores.persistentKeyValueStore("BallPossesionStore"), Serdes.Long(), ballPossessionSerde)
                    .withCachingEnabled();
            builder.addStateStore(ballPossessionStore);

            final StoreBuilder<KeyValueStore<Long, BallPossessionStatsV1>> ballPossessionStatsStore = Stores
                    .keyValueStoreBuilder(Stores.persistentKeyValueStore("BallPossesionStatsStore"), Serdes.Long(), ballPossessionStatsSerde)
                    .withCachingEnabled();
            builder.addStateStore(ballPossessionStatsStore);

            final KStream<String, BallPossessionEventV1> source = builder.stream(topicSource);
            source.peek((k,v) -> System.out.println("================> " + v.toString()));

            KStream<String, BallPossessionStatsV1> ballPossessionStats = source.transformValues(() -> new CommandHandler(ballPossessionStore.name(), ballPossessionStatsStore.name()), ballPossessionStore.name(), ballPossessionStatsStore.name());
            ballPossessionStats.peek((k,v) -> System.out.println("================> " + v.toString()));

            ballPossessionStats.to(topicSink);

            return builder.build();
        }
    }

    private static final class CommandHandler implements ValueTransformer<BallPossessionEventV1, BallPossessionStatsV1> {
        final private String storeName;
        final private String statsStoreName;
        private KeyValueStore<Long, BallPossessionEventV1> stateStore;
        private KeyValueStore<Long, BallPossessionStatsV1> statsStateStore;
        private ProcessorContext context;

        public CommandHandler(final String storeName, final String statsStoreName) {
            Objects.requireNonNull(storeName,"Store Name can't be null");
            Objects.requireNonNull(statsStoreName,"Store Name can't be null");
            this.storeName = storeName;
            this.statsStoreName = statsStoreName;
        }

        @SuppressWarnings("unchecked")
        @Override
        public void init(ProcessorContext context) {
            this.context = context;
            stateStore = (KeyValueStore<Long, BallPossessionEventV1>) this.context.getStateStore(storeName);
            statsStateStore = (KeyValueStore<Long, BallPossessionStatsV1>) this.context.getStateStore(statsStoreName);
        }

        @Override
        public BallPossessionStatsV1 transform(BallPossessionEventV1 ballPossessionEvent) {
            long homeBallPossessionMs = 0;
            long awayBallPossessionMs = 0;

            BallPossessionEventV1 prevBallPossessionEvent = stateStore.get(ballPossessionEvent.getMATCHID());
            stateStore.put(ballPossessionEvent.getMATCHID(), ballPossessionEvent);

            if (prevBallPossessionEvent != null) {
                if (prevBallPossessionEvent.getOBJECTTYPE() == 1) {
                    homeBallPossessionMs = ballPossessionEvent.getTS() - prevBallPossessionEvent.getTS();
                } else {
                    awayBallPossessionMs = ballPossessionEvent.getTS() - prevBallPossessionEvent.getTS();
                }
            }

            BallPossessionStatsV1 currentBallPossessionStats = statsStateStore.get(ballPossessionEvent.getMATCHID());
            if (currentBallPossessionStats != null) {
                currentBallPossessionStats.setHomeTeamDurationMs(currentBallPossessionStats.getHomeTeamDurationMs() + homeBallPossessionMs);
                currentBallPossessionStats.setAwayTeamDurationMs(currentBallPossessionStats.getAwayTeamDurationMs() + awayBallPossessionMs);
            } else {
                currentBallPossessionStats = BallPossessionStatsV1.newBuilder().setMatchId(ballPossessionEvent.getMATCHID()).setAwayTeamDurationMs(awayBallPossessionMs).setHomeTeamDurationMs(homeBallPossessionMs).setHomeTeamPercentage(0d).setAwayTeamPercentage(0d).build();
            }
            double total = currentBallPossessionStats.getHomeTeamDurationMs() + currentBallPossessionStats.getAwayTeamDurationMs();
            currentBallPossessionStats.setHomeTeamPercentage(currentBallPossessionStats.getHomeTeamDurationMs() / total);
            currentBallPossessionStats.setAwayTeamPercentage(currentBallPossessionStats.getAwayTeamDurationMs() / total);

            statsStateStore.put(ballPossessionEvent.getMATCHID(), currentBallPossessionStats);
            return currentBallPossessionStats;
        }

        @Override
        public void close() {
            // TODO Auto-generated method stub

        }

    }

}