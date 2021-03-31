export class PlayerStat {
  playerId: number;
  name: string;
  possessionPercentage: number;
  possessionMinutes: number;


  constructor(playerId: number, name: string, possessionPercentage: number, possessionMinutes: number) {
    this.playerId = playerId;
    this.name = name;
    this.possessionPercentage = possessionPercentage;
    this.possessionMinutes = possessionMinutes;
  }
}
