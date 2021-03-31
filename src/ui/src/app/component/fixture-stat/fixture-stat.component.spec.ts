import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureStatComponent } from './fixture-stat.component';

describe('FixtureStatComponent', () => {
  let component: FixtureStatComponent;
  let fixture: ComponentFixture<FixtureStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureStatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
