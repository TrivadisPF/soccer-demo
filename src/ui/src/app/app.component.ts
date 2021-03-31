import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BrokerService} from './services/broker.service';
import {BallZoneService} from './services/ball/ball-zone.service';
import {TerrainOccupation} from './util/terrain-occupation';
import {Stats} from './util/stats';
import {BallPosessionService} from './services/posession/ball-posession.service';
import {BallPosessionStat} from './util/ball-posession-stat';
import {BallPossession} from './util/ball-possession';
import {MatchEventService} from './services/match/match-event.service';
import {FixtureService} from './services/fixture/fixture.service';
import {PlayerStat} from './util/player-stat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fifa-demo';
  HOME_TEAM_ID = 73;
  VISITOR_TEAM_ID = 90;

  ballPossessions: BallPossession[] = [];

  private DURATION = 2700000; // 45 min in ms
  private occupation: TerrainOccupation = new TerrainOccupation('Portugal', 'Switzerland', this.DURATION);

  stats: Stats = new Stats('Portugal', this.HOME_TEAM_ID, 'Switzerland', this.VISITOR_TEAM_ID);
  currentTime: number;
  showVideo = true;
  startVideoAt = 1.9;

  players: Map<number, string>;

  homePlayerStats: PlayerStat[] = [];
  visitorPlayerStats: PlayerStat[] = [];
  visitorPlayers: Map<string, string> = new Map<string, string>();
  homePlayers: Map<string, string> = new Map<string, string>();

  @ViewChild('videoPlayer', {static: false})
  videoplayer: ElementRef;

  constructor(private httpClient: HttpClient,
              private broker: BrokerService,
              private ballZoneService: BallZoneService,
              private ballPosessionService: BallPosessionService,
              private matchEventService: MatchEventService,
              private fixtureService: FixtureService,
  ) {
    this.players = new Map();
  }

  ngOnInit(): void {


    this.fixtureService.getFixture().subscribe(result => {
      if (!result.loading && result.data && result.data.football_db_game_t) {

        result.data.football_db_game_t[0].lineups.forEach(l => {
          this.players.set(l.player_id, l.player.full_name);
          const playerStat = new PlayerStat(l.player_id, l.player.full_name, 0, 0);
          l.team_id === this.VISITOR_TEAM_ID ? this.visitorPlayerStats.push(playerStat) : this.homePlayerStats.push(playerStat);
          l.team_id === this.VISITOR_TEAM_ID ? this.visitorPlayers.set(l.player.full_name, l.player_id + '') : this.homePlayers.set(l.player.full_name, l.player_id + '');
        });
      }
    });

    this.matchEventService.matchEventSubject.subscribe(_ => this.start());
    this.matchEventService.listen();

    setTimeout(() => {
      this.ballPosessionService.ballPossessionSubject.subscribe(data => {

        if (data && data.playerId) {
          this.ballPossessions = [data, ...this.ballPossessions];
        }

      });
    }, 1000);

    this.ballPosessionService.collectPosession();

    setTimeout(() => {
        this.ballPosessionService.ballPosessionStatSubject.subscribe(data => {
          this.stats.refreshFromBallPossession(data);

          data.playersDurationsMs.forEach((stat, playerName) => {

            if (this.homePlayers.has(playerName)) {
              this.homePlayerStats.find(p => p.name === playerName).possessionMinutes = (stat / 60000);
            } else if (this.visitorPlayers.has(playerName)) {
              this.visitorPlayerStats.find(p => p.name === playerName).possessionMinutes = (stat / 60000);
            }
          });

          data.playersPercentages.forEach((stat, playerName) => {

            if (this.homePlayers.has(playerName)) {
              this.homePlayerStats.find(p => p.name === playerName).possessionPercentage = stat;
            } else if (this.visitorPlayers.has(playerName)) {
              this.visitorPlayerStats.find(p => p.name === playerName).possessionPercentage = stat;
            }
          });
        });
        this.ballPosessionService.collectPosessionStats();
      },
      2000);


  }

  start(): void {
    this.playSound();
    this.videoplayer.nativeElement.play();

  }

  setCurrentTime(data): void {
    this.currentTime = data.target.currentTime;
  }

  playSound(): void {
    const audio = new Audio();
    audio.src = 'assets/audio/match_start.mp3';
    audio.load();
    audio.play();
  }


  trackBallPosessions(idx: number, bp: BallPossession): number {
    return bp.ts ? bp.ts : undefined;
  }


  matchPlayerId(playerId: number): string {
    return this.players.get(playerId) ? this.players.get(playerId) : 'unknown';
  }


}
