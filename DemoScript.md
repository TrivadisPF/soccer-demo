## Ball Possession (ksqlDB & Faust)

On my Mac

```
kafkacat -b dataplatform:9092 -t game_movement_event_v1 -s avro -r http://dataplatform:8081
```

Faust Player Near Ball [worker_fbRawGames.py](./src/faust/fbRawGames/worker_fbRawGames.py)

```python
def ballPossession(playerId, ballId, distance=3):
    dist = euclidianDistance((ballId[0], ballId[1], ballId[2]),(playerId[0], playerId[1], playerId[2]))
    #distance below 3 meters count as ball possession
    if dist < 3:
        return((True, dist))
    else:
        return(False, -1)

# calculate the euclidian distance between two points in a 3 dimensional vector space
def euclidianDistance(point1, point2):
    return(math.sqrt((float(point1[0]) - float(point2[0]))**2 + (float(point1[1]) - float(point2[1]))**2 + (float(point1[2]) - float(point2[2]))**2))


@app.agent(rawGameTopic)
async def process(stream):
    async for key, value in stream.items():
        #only work with the elements of the MATCH_ID
        if key.decode("utf-8").split('.')[0] == MATCH_ID:
            
            #write the element to the table 'fbBallPossessionTable'
            fbBallPossessionTable[key] = value

            #if ball key
            if key == bytes(BALL_KEY, 'utf-8'):
                ball = fbBallPossessionTable[bytes(BALL_KEY, 'utf-8')]
                #print(ball)
                elements = []
                for key_elem, value_elem in zip(fbBallPossessionTable.keys(), fbBallPossessionTable.values()):
                    if not (key_elem == bytes(BALL_KEY, 'utf-8')) and not (str(value_elem) == ''):
                        #print('--key--')
                        #print(key_elem)
                        dist = ballPossession((value_elem.x, value_elem.y, value_elem.z), (ball.x, ball.y, ball.z), distance=ballPossessionDistance)
                        if dist[0]:
                            #create list element in a set
                            elements.append((key_elem, value_elem, dist[1]))

                if not len(elements) == 0:
                    #write to 'fbBallPossession' topic
                    # if more than 1 player is close to the ball then the closest has ball possession
                    best = elements[0]
                    for elem in elements:
                        if elem[2] < best[2]:
                            best = elem
                    #print(best)

                    #send record to topic 'fbBallPossessionTopic'
                    await fbBallPossessionTopic.send(key=bytes(str(best[0]), 'utf-8'), value=GameEvent(ts=str(best[1].ts), playtimeMs=str(best[1].playtimeMs), x=float(best[1].x), y=float(best[1].y), z=float(best[1].z), sensorId=int(best[1].sensorId), matchId=int(best[1].matchId)))
```

Faust Player Near Ball [worker_fbBallPossession.py](./src/faust/fbBallPossession/worker_fbBallPossession.py)


Select output

```
SELECT * FROM ball_possession_aggregate_s EMIT CHANGES;
```

SELECT on Data

```
SELECT bp.id
  		, STRINGTOTIMESTAMP(bp.ts, 'yyyy.MM.dd''T''HH:mm:ss.SSS') AS ts
  		, bp.ts AS ts_string
  		, CAST (bp.playtimeMs AS bigint) AS playtimeMs
  		, bp.eventtype AS eventtype
  		, bp.sensorId AS sensorId
  		, bp.matchId AS matchId
  		, glp.position AS position
  		, glp.playerId AS playerId
  		, p.name
  		, p.full_name
  		, glp.team as team
  		, glp.teamId as teamId
  		, CASE WHEN (glp.team = 'home') THEN 1 ELSE 2 END as objectType
FROM ball_possession_aggregate_s bp
INNER JOIN game_lineup_player_t glp 
	ON glp.sensorId  = bp.sensorId
INNER JOIN player_t p 
	ON p.id = glp.playerId
EMIT CHANGES;
```


```
CREATE STREAM ball_possession_event_s
WITH (
    kafka_topic = 'ball_possession_event_v1',
    PARTITIONS=1, 
    REPLICAS=1,
    VALUE_FORMAT='AVRO',
    VALUE_AVRO_SCHEMA_FULL_NAME='com.trivadis.demo.soccer.BallPossessionEventV1'
)
AS
SELECT bp.id
  		, STRINGTOTIMESTAMP(bp.ts, 'yyyy.MM.dd''T''HH:mm:ss.SSS') AS ts
  		, bp.ts AS ts_string
  		, CAST (bp.playtimeMs AS bigint) AS playtimeMs
  		, bp.eventtype AS eventtype
  		, bp.sensorId AS sensorId
  		, bp.matchId AS matchId
  		, glp.position AS position
  		, glp.playerId AS playerId
  		, p.name
  		, p.full_name
  		, glp.team as team
  		, glp.teamId as teamId
  		, CASE WHEN (glp.team = 'home') THEN 1 ELSE 2 END as objectType
FROM ball_possession_aggregate_s bp
INNER JOIN game_lineup_player_t glp 
	ON glp.sensorId  = bp.sensorId
INNER JOIN player_t p 
	ON p.id = glp.playerId
PARTTION BY bp.id
EMIT CHANGES;
```



## Ball Possession Statistics (Kafka Streams)

Calc Statistics [](./src/faust/fbBallPossession/worker_fbBallPossession.py)


```
```

```
SELECT * FROM ball_possession_stats_event_s emit changes;
```

## Ball in Zone (ksqlDB)


## Lineup & Player Information (GraphQL)



```
curl -X POST -H 'X-SDC-APPLICATION-ID: abc123!' -i http://localhost:8000 --data '{
    "matchId": 19060518,
    "homeTeamPlayers": [
        {
            "playerId": 178005,
            "position": "GK",
            "sensorId": 0
        },
        {
            "playerId": 120533,
            "position": "LB",
            "sensorId": 0
        },   
        {
            "playerId": 239818,
            "position": "LB",
            "sensorId": 0
        },  
        {
            "playerId": 209889,
            "position": "WLB",
            "sensorId": 0
        },                       
        {
            "playerId": 20801,
            "position": "MF",
            "sensorId": 0
        }, 
        {
            "playerId": 218667,
            "position": "MF",
            "sensorId": 0
        },             
        {
            "playerId": 207566,
            "position": "MF",
            "sensorId": 0
        },                       
        {
            "playerId": 212198,
            "position": "MV",
            "sensorId": 0
        }, 
        {
            "playerId": 224293,
            "position": "MV",
            "sensorId": 0
        },             
        {
            "playerId": 227928,
            "position": "MF",
            "sensorId": 0
        },  
        {
            "playerId": 242444,
            "position": "ST",
            "sensorId": 0
        }
    ],
    "awayTeamPlayers": [
        {
            "playerId": 177683,
            "position": "GK",
            "sensorId": 0
        },
        {
            "playerId": 210625,
            "position": "LB",
            "sensorId": 0
        },   
        {
            "playerId": 229237,
            "position": "LB",
            "sensorId": 0
        },  
        {
            "playerId": 202024,
            "position": "LB",
            "sensorId": 0
        },                       
        {
            "playerId": 193408,
            "position": "ST",
            "sensorId": 0
        }, 
        {
            "playerId": 199503,
            "position": "MF",
            "sensorId": 0
        },             
        {
            "playerId": 244343,
            "position": "LB",
            "sensorId": 0
        },                       
        {
            "playerId": 190059,
            "position": "LB",
            "sensorId": 0
        }, 
        {
            "playerId": 229261,
            "position": "MF",
            "sensorId": 0
        },             
        {
            "playerId": 210047,
            "position": "LB",
            "sensorId": 0
        },  
        {
            "playerId": 193348,
            "position": "MF",
            "sensorId": 0
        }
    ]
}'
```

Update with Sensor

```
curl -X POST -H 'X-SDC-APPLICATION-ID: abc123!' -i http://localhost:8000 --data '{
    "matchId": 19060518,
    "homeTeamPlayers": [
        {
            "playerId": 178005,
            "position": "GK",
            "sensorId": 1
        },
        {
            "playerId": 120533,
            "position": "LB",
            "sensorId": 3
        },   
        {
            "playerId": 239818,
            "position": "LB",
            "sensorId": 4
        },  
        {
            "playerId": 209889,
            "position": "WLB",
            "sensorId": 5
        },                       
        {
            "playerId": 20801,
            "position": "MF",
            "sensorId": 7
        }, 
        {
            "playerId": 218667,
            "position": "MF",
            "sensorId": 10
        },             
        {
            "playerId": 207566,
            "position": "MF",
            "sensorId": 14
        },                       
        {
            "playerId": 212198,
            "position": "MV",
            "sensorId": 16
        }, 
        {
            "playerId": 224293,
            "position": "MV",
            "sensorId": 18
        },             
        {
            "playerId": 227928,
            "position": "MF",
            "sensorId": 20
        },  
        {
            "playerId": 242444,
            "position": "ST",
            "sensorId": 23
        }
    ],
    "awayTeamPlayers": [
        {
            "playerId": 177683,
            "position": "GK",
            "sensorId": 101
        },
        {
            "playerId": 210625,
            "position": "LB",
            "sensorId": 102
        },   
        {
            "playerId": 229237,
            "position": "LB",
            "sensorId": 105
        },  
        {
            "playerId": 202024,
            "position": "LB",
            "sensorId": 108
        },                       
        {
            "playerId": 193408,
            "position": "ST",
            "sensorId": 109
        }, 
        {
            "playerId": 199503,
            "position": "MF",
            "sensorId": 110
        },             
        {
            "playerId": 244343,
            "position": "LB",
            "sensorId": 113
        },                       
        {
            "playerId": 190059,
            "position": "LB",
            "sensorId": 114
        }, 
        {
            "playerId": 229261,
            "position": "MF",
            "sensorId": 117
        },             
        {
            "playerId": 210047,
            "position": "LB",
            "sensorId": 122
        },  
        {
            "playerId": 193348,
            "position": "MF",
            "sensorId": 123
        }
    ]
}'
```


