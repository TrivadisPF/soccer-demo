import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

declare var oboe: any;

@Injectable({
  providedIn: 'root'
})
export class BrokerService {

  private oboeService: any;

  constructor() {

  }

  listen(): void {


    const data = {
      ksql: 'SELECT * FROM fixture_livestream_s EMIT CHANGES;',
      streamsProperties: {
        'ksql.streams.auto.offset.reset': 'latest'
      }
    };


    console.log('registering message broker');
    const config = {
      url: '/api/query',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: data,
      cached: false,
      withCredentials: false
    };
    this.oboeService = oboe(config);
    // The '!' will only consume complete json objects
    this.oboeService.node('row', (thing) => {
      console.log('new broker message', thing);
    });
  }
}
