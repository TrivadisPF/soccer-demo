import { TestBed } from '@angular/core/testing';

import { MatchEventService } from './match-event.service';

describe('MatchEventService', () => {
  let service: MatchEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
