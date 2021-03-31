export class BallPossession {
  /*
   // tslint:disable-next-line:max-line-length
  "`BP_ID` BIGINT, `TS` BIGINT, `TS_STRING` STRING, `PLAYTIMEMS` BIGINT, `EVENTTYPE`
  STRING, `SENSORID` INTEGER, `MATCHID` INTEGER, `POSITION` STRING, `PLAYERID` INTEGER, `NAME` STRING,
  `FULL_NAME` STRING, `TEAM` STRING, `TEAMID` BIGINT, `OBJECTTYPE` INTEGER"


  */

  bpId: number;
  ts: number;
  tsString: string;
  playtimeMs: number;
  eventType: string;
  sensorId: number;
  matchId: number;
  position: string;
  playerId: number;
  name: string;
  fullName: string;
  team: string;
  teamId: number;
  objectType: number;

  constructor(stream?: Array<any>) {

    if (stream) {
      this.bpId = stream[0];
      this.ts = stream[1];
      this.tsString = stream[2];
      this.playtimeMs = stream[3];
      this.eventType = stream[4];
      this.sensorId = stream[5];
      this.matchId = stream[6];
      this.position = stream[7];
      this.playerId = stream[8];
      this.name = stream[9];
      this.fullName = stream[10];
      this.team = stream[11];
      this.teamId = stream[12];
      this.objectType = stream[13];
    }
  }
}
