import {BallPosessionStat} from './ball-posession-stat';

export class Stats {
  homeTeam: string;
  homeTeamId: number;
  visitorTeam: string;
  visitorTeamId: number;
  homeTeamPasses = 0;
  homeTeamPosessionMs: number;
  homeTeamPosessionPercentage: number;
  visitorTeamPasses = 0;
  visitorTeamPosessionMs: number;
  visitorTeamPosessionPercentage: number;

  constructor(homeTeam: string, homeTeamId: number, visitorTeam: string, visitorTeamId: number) {
    this.homeTeam = homeTeam;
    this.homeTeamId = homeTeamId;
    this.visitorTeam = visitorTeam;
    this.visitorTeamId = visitorTeamId;
  }

  refreshFromBallPossession(ballPosession: BallPosessionStat): void {
    this.homeTeamPosessionMs = ballPosession.homeTeamDurationMs;
    this.homeTeamPosessionPercentage = ballPosession.homeTeamPercentage;
    this.visitorTeamPosessionMs = ballPosession.awayTeamDurations;
    this.visitorTeamPosessionPercentage = ballPosession.awayTeamPercentage;
  }
}
