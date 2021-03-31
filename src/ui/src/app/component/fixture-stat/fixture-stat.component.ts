import {Component, Input, OnInit} from '@angular/core';
import {Stats} from '../../util/stats';
import {PlayerStat} from '../../util/player-stat';

@Component({
  selector: 'app-fixture-stat',
  templateUrl: './fixture-stat.component.html',
  styleUrls: ['./fixture-stat.component.css']
})
export class FixtureStatComponent implements OnInit {

  @Input()
  stats: Stats;

  @Input()
  visitor: boolean;

  @Input()
  playerStats: PlayerStat[];

  constructor() {
  }

  ngOnInit(): void {

  }

}
