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

import com.trivadis.demo.soccer.BallPossessionEventV1;
import com.trivadis.demo.soccer.BallPossessionStatsEventV1;
import com.trivadis.demo.soccer.GameEventV1;
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

}