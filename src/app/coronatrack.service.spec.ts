import { TestBed } from '@angular/core/testing';

import { CoronatrackService } from './coronatrack.service';

describe('CoronatrackService', () => {
  let service: CoronatrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoronatrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
