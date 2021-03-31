import {BehaviorSubject} from 'rxjs';

export class BallPosessionStat {

//"schema":"`MATCHID` INTEGER, `HOMETEAMDURATIONMS` BIGINT, `HOMETEAMPERCENTAGE` DOUBLE,
// `AWAYTEAMDURATIONMS` BIGINT, `AWAYTEAMPERCENTAGE` DOUBLE,
// `PLAYERSDURATIONSMS` MAP<STRING, BIGINT>, `PLAYERSPERCENTAGES` MAP<STRING, DOUBLE>"}},


  matchId: number;
  homeTeamDurationMs: number;
  homeTeamPercentage: number;
  awayTeamDurations: number;
  awayTeamPercentage: number;
  playersDurationsMs: Map<string, number> = new Map<string, number>();
  playersPercentages: Map<string, number> = new Map<string, number>();


  constructor(stream?: Array<any>, players?: Map<number, string>) {
    if (stream && stream.length > 0) {

      this.matchId = stream[0];
      this.homeTeamDurationMs = stream[1];
      this.homeTeamPercentage = stream[2];
      this.awayTeamDurations = stream[3];
      this.awayTeamPercentage = stream[4];

      let _playersDurationsMs = new Map(Object.entries(stream[5]));
      _playersDurationsMs.forEach((v, k) => {
        const player = players.get(parseInt(k));
        const stat = (v as number);

        this.playersDurationsMs.set(player, stat);
      });

      let _playersDurationsPercentage = new Map(Object.entries(stream[6]));
      _playersDurationsPercentage.forEach((v, k) => {
        const player = players.get(parseInt(k));
        const stat = (v as number);

        this.playersPercentages.set(player, stat);
      });

    }

  }
}
