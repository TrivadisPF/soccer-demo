import {BehaviorSubject} from 'rxjs';

export class TerrainOccupation {
  private stats: Map<string, number> = new Map<string, number>();
  private duration: number;
  private current: string = null;
  private stopWatch: number;
  public subject: BehaviorSubject<Array<number>>;
  private regex: RegExp;
  private homeTeam: string;
  private visitorTeam: string;

  constructor(homeTeam: string, visitorTeam: string, duration: number) {
    this.duration = duration;
    const initialOccupation = duration / 2;
    this.stats.set(homeTeam, initialOccupation);
    this.stats.set(visitorTeam, initialOccupation);
    this.subject = new BehaviorSubject<Array<number>>([initialOccupation, initialOccupation]);
    this.regex = new RegExp('enter.+(' + homeTeam + '|' + visitorTeam + ')', 'i');
    this.homeTeam = homeTeam;
    this.visitorTeam = visitorTeam;

  }

  public processEvent(data: Array<any>[]): void {

    if (data) {

      const matchResult = (data[1] + '').match(this.regex);

      if (matchResult && matchResult[1] && (this.stats.get(matchResult[1]))) {

        if (this.current == null) { // first time we get ballPossessions do not emit but start time
          this.current = matchResult[1];
          this.stopWatch = new Date().getTime();
          return;
        }

        if (this.current !== matchResult[1]) {
          const previous = this.current;
          this.current = matchResult[1];
          const elapsedTime = (new Date().getTime()) - this.stopWatch;
          this.stats.set(previous, this.stats.get(previous) + elapsedTime);
          this.stats.set(this.current, this.stats.get(this.current) - elapsedTime);
          this.subject.next([this.stats.get(this.homeTeam), this.stats.get(this.visitorTeam)]);
          console.log('Ball changed terrain side : ' + data);
        }
      }
    }

  }
}
