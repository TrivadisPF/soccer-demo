import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {gql} from '@apollo/client/core';
import {Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  fixtureSubject: Subject<Map<number, string>> = new Subject<Map<number, string>>();
  players: Map<number, string> = new Map<number, string>();

  constructor(private apollo: Apollo) {


  }

  getPlayers(): Promise<Map<number, string>> {
    if (this.players) {
      return new Promise<Map<number, string>>((resolve, reject) => {
        resolve(this.players);
      });
    } else {
      this.getFixture();
      return this.fixtureSubject.toPromise();
    }
  }

  getFixture(): Observable<any> {


    return this.apollo.query<any>({
      query: gql`
           {
  football_db_game_t {
    lineups {
      team_id
      player {
        full_name
      }
      player_id
    }
  }
}`
    }).pipe(tap(result => {
      if (!result.loading && result.data && result.data.football_db_game_t) {

        result.data.football_db_game_t[0].lineups.forEach(l => {
          this.players.set(l.player_id, l.player.full_name);
        });
        this.fixtureSubject.next(this.players);

      }
    }));
  }
}
