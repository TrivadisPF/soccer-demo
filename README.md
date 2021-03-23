# Soccer Streaming Demo

This project shows how to setup and run the demo used ... 

![Alt Image Text](./images/use-case-overview.png "Use Case Overview")

## Preparation (tbd)

The platform where the demos can be run on, has been generated using the [`platys`](http://github.com/trivadispf/platys)  toolset using the [`platys-modern-data-platform`](http://github.com/trivadispf/platys-modern-data-platform) stack.

The generated artefacts are available in the `./docker` folder.

The prerequisites for running the platform are 
 
 * Docker 
 * Docker Compose. 

The environment is completely based on docker containers. In order to easily start the multiple containers, we are going to use Docker Compose. You need to have at least 8 GB of RAM available, better is 12 GB or 16 GB.

### Start the platform using Docker Compose (tbd.)

First, create the following two environment variables, which export the Public IP address (if a cloud environment) and the Docker Engine (Docker Host)  IP address:

``` bash
export DOCKER_HOST_IP=<docker-host-ip>
export PUBLIC_IP=<public-host-ip>
```

You can either add them to `/etc/environment` (without export) to make them persistent or use an `.env` file inside the `docker` folder with the two variables.

It is very important that these two are set, otherwise the platform will not run properly.

Now navigate into the `docker` folder and start `docker-compose`.

``` bash
cd ./docker

docker-compose up -d
```

To show all logs of all containers use

``` bash
docker-compose logs -f
```

To show only the logs for some of the containers, for example `kafka-connect-1` and `kafka-connect-2`, use


``` bash
docker-compose logs -f kafka-connect-1 kafka-connect-2
```

Some services in the `docker-compose.yml` are optional and can be removed, if you don't have enough resources to start them. 

As a final step, add `dataplatform` as an alias to the `/etc/hosts` file so that the links used in this document work. 

```
<public-host-ip>		dataplatform
```

If you have no rights for doing that, then you have to use your IP address instead of `dataplatform` in all the URLs.  

### Available Services (tbd.)

The following user interfaces are available:

 * Cluster Manager for Apache Kafka: <http://dataplatform:28104> 
 * Apache Kafka HQ: <http://dataplatform:28107>
 * Schema Registry UI: <http://dataplatform:28102>
 * Kafka Connect UI: <http://dataplatform:28103>
 * StreamSets Data Collector: <http://dataplatform:18630>
 * MQTT UI: <http://dataplatform:28136>
 * Cloudbeaver: <http://dataplatform:8978>


## Data Wrangling

Download the data from: <https://data.world/raghav333/fifa-players>

```
docker exec -ti awscli s3cmd mb s3://fifa-bucket
docker exec -ti awscli s3cmd put /data-transfer/fifa_cleaned.csv s3://fifa-bucket/
docker exec -ti awscli s3cmd put /data-transfer/football-positions.csv s3://fifa-bucket/
```

## Create Kafka Topics

```
docker exec -ti kafka-1 kafka-topics --create --zookeeper zookeeper-1:2181 --topic match_raw_v1 --replication-factor 3 --partitions 1
```





``` bash
docker exec -it ksqldb-cli ksql http://ksqldb-server-1:8088
```

```sql
CREATE TABLE match_raw_t (
  rowkey BIGINT PRIMARY KEY, 
  match_id BIGINT, 
  pitch_x_size DOUBLE, 
  pitch_y_size DOUBLE) 
WITH (KAFKA_TOPIC='match_raw_v1', 
		PARTITIONS=1, 
		REPLICAS=1, 
		VALUE_FORMAT='AVRO');
```

```sql
INSERT INTO raw_meta_data_match_t (rowkey, match_id, pitch_x_size , pitch_y_size) 
VALUES (19060518, 19060518, 105.0, 68.0);
```


```sql
CREATE STREAM raw_meta_data_match_s (
  rowkey BIGINT KEY, 
  match_id BIGINT, 
  pitch_x_size DOUBLE, 
  pitch_x_size DOUBLE) 
WITH (KAFKA_TOPIC='rawMetaMatch', PARTITIONS=1, REPLICAS=1, VALUE_FORMAT='JSON');
```

-- Tabelle mit Topic fbFieldPos neu erstellen
CREATE TABLE t_fbFieldPos 
WITH (KAFKA_TOPIC='fbFieldPos', PARTITIONS=1, REPLICAS=1, VALUE_FORMAT='JSON')
as
select
  matchId, 
  STRUCT( Xmin := -(PITCHXSIZE/2), Xmax := (PITCHXSIZE/2), Ymin := -(PITCHYSIZE/2), Ymax := (PITCHYSIZE/2)) AS pitch,
  STRUCT( Xmin := -(PITCHXSIZE/2), Xmax := 0, Ymin := -(PITCHYSIZE/2), Ymax := (PITCHYSIZE/2)) AS pitchLeft, 
  STRUCT( Xmin := 0, Xmax := (PITCHXSIZE/2), Ymin := -(PITCHYSIZE/2), Ymax := (PITCHYSIZE/2)) AS pitchRight, 
  STRUCT( Xmin := -(PITCHXSIZE/2), Xmax := -(PITCHXSIZE/2)+16.5, Ymin := (-20.16), Ymax := 20.16) AS penaltyBoxLeft, 
  STRUCT( Xmin := (PITCHXSIZE/2)-16.5, Xmax := (PITCHXSIZE/2), Ymin := (-20.16), Ymax := 20.16) AS penaltyBoxRight, 
  STRUCT( Xmin := -(PITCHXSIZE/2)-2.0, Xmax := -(PITCHXSIZE/2), Ymin := -3.66, Ymax := 3.66 ) AS goalLeft, 
  STRUCT( Xmin := (PITCHXSIZE/2), Xmax := (PITCHXSIZE/2)+2.0, Ymin := (-3.66), Ymax := 3.66 ) AS goalRight
FROM t_rawMetaMatch
EMIT CHANGES;


This was the game

<https://de.uefa.com/uefanationsleague/match/2024419--portugal-vs-switzerland/stories/?iv=true>