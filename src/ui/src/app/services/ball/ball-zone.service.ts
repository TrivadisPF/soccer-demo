import {Injectable} from '@angular/core';

import * as o from 'oboe';


@Injectable({
  providedIn: 'root'
})
export class BallZoneService {

  constructor() {
  }


  retrieveData(): o.Oboe {
    const data = {
      ksql: 'select * from ball_in_zone_event_t where ball_event is not null emit changes;',
      streamsProperties: {
        'ksql.streams.auto.offset.reset': 'latest'
      }
    };

    const config = {
      url: '/api/query',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: data,
      cached: false,
      withCredentials: false
    };

    return o(config);
  }
}




