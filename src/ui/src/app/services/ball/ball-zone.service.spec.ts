import { TestBed } from '@angular/core/testing';

import { BallZoneService } from './ball-zone.service';

describe('BallZoneService', () => {
  let service: BallZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BallZoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
