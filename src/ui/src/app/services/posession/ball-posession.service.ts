import {Injectable} from '@angular/core';
import * as oboe from 'oboe';
import {BehaviorSubject} from 'rxjs';
import {BallPosessionStat} from '../../util/ball-posession-stat';
import {BallPossession} from '../../util/ball-possession';
import {FixtureService} from '../fixture/fixture.service';


@Injectable({
  providedIn: 'root'
})
export class BallPosessionService {

  players: Map<number, string> = new Map<number, string>();

  constructor(private fixtureService: FixtureService) {
    this.fixtureService.getPlayers().then(players => this.players = players);
  }

  public static BALL_POSSESION_STAT_STREAM = 'ball_possesion_stat';

  public ballPosessionStatSubject: BehaviorSubject<BallPosessionStat> =
    new BehaviorSubject<BallPosessionStat>(new BallPosessionStat());

  public ballPossessionSubject: BehaviorSubject<BallPossession> =
    new BehaviorSubject<BallPossession>(new BallPossession());


  streamSets: Map<string, oboe.Oboe> = new Map<string, oboe.Oboe>();
  processionStatsData = {
    ksql: 'SELECT * FROM ball_possession_stats_event_s emit changes;',
    streamsProperties: {
      'ksql.streams.auto.offset.reset': 'latest'
    }
  };

  posessionStatsConfig = {
    url: '/api/query',
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-store'},
    body: this.processionStatsData,
    cached: false,
    withCredentials: false
  };


  collectPosessionStats(): void {

    // "schema":"`MATCHID` BIGINT, `HOMETEAMDURATIONMS` BIGINT,
    // `HOMETEAMPERCENTAGE` DOUBLE, `AWAYTEAMDURATIONMS` BIGINT, `AWAYTEAMPERCENTAGE` DOUBLE"}},
    // {"row":{"columns":[19060518,4320,19.529837251356238,17800,80.47016274864376]}},

    this.streamSets.set(BallPosessionService.BALL_POSSESION_STAT_STREAM,
      // tslint:disable-next-line:max-line-length
      oboe(this.posessionStatsConfig).node('row.columns', this.processPosessionStats.bind(this))); // bind to this so that within the callback this = BallPosessionService

  }

  processPosessionStats(stream: Array<any>): void {
    this.ballPosessionStatSubject.next(new BallPosessionStat(stream, this.players));
  }


  collectPosession(): void {

    // "schema":"`MATCHID` BIGINT, `HOMETEAMDURATIONMS` BIGINT,
    // `HOMETEAMPERCENTAGE` DOUBLE, `AWAYTEAMDURATIONMS` BIGINT, `AWAYTEAMPERCENTAGE` DOUBLE"}},
    // {"row":{"columns":[19060518,4320,19.529837251356238,17800,80.47016274864376]}},
    const data = {
      ksql: 'SELECT * FROM ball_possession_event_s emit changes;',
      streamsProperties: {
        'ksql.streams.auto.offset.reset': 'latest'
      }
    };

    const config = {
      url: 'http://18.197.89.131:8088/api/query',
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-store'},
      body: data,
      cached: false,
      withCredentials: false
    };

    oboe(config).node('row.columns', stream => {
      this.ballPossessionSubject.next(new BallPossession(stream));
    });
  }


  /**
   * Stops the named stream collection by removing the listener
   * as well as aborting the HTTP connection
   * @param streamName the name of the stream for which the collection has to be stopped
   */
  stopCollecting(streamName: string): void {
    // TODO: add check for stream if exists
    this.streamSets.get(streamName).removeListener('node', 'row.columns', this.processPosessionStats);
    this.streamSets.get(streamName).abort();

  }

}
