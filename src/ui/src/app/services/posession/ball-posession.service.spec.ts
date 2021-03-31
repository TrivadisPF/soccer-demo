import { TestBed } from '@angular/core/testing';

import { BallPosessionService } from './ball-posession.service';

describe('BallPosessionService', () => {
  let service: BallPosessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BallPosessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
