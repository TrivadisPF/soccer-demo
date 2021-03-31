import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {BallPosessionStat} from '../../util/ball-posession-stat';
import {BallPossession} from '../../util/ball-possession';
import * as oboe from 'oboe';

@Injectable({
  providedIn: 'root'
})
export class MatchEventService {

  constructor() {
  }


  public matchEventSubject: Subject<string> = new Subject<string>();


  oboe: oboe.Oboe;
  gameStatsEventData = {
    ksql: 'select * from game_event_s emit changes;',
    streamsProperties: {
      'ksql.streams.auto.offset.reset': 'latest'
    }
  };

  gameStatsEventDataConfig = {
    url: '/api/query',
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-store'},
    body: this.gameStatsEventData,
    cached: false,
    withCredentials: false
  };


  listen(): void {

    this.oboe = oboe(this.gameStatsEventDataConfig)
      .node('row.columns', this.processEvent.bind(this)); // bind to this so that within the callback this = BallPosessionService

  }

  processEvent(_: Array<any>): void {
    console.log(_);
    console.log('match event start received stoping consumption');
    this.matchEventSubject.next('start');
    this.matchEventSubject.complete();
    this.stopCollecting();
  }


  /**
   * Stops the named stream collection by removing the listener
   * as well as aborting the HTTP connection
   * @param streamName the name of the stream for which the collection has to be stopped
   */
  stopCollecting(): void {

    this.oboe.removeListener('node', 'row.columns', this.processEvent);
    this.oboe.abort();

  }
}
