import { TestBed } from '@angular/core/testing';

import { RateToTextService } from './rate-to-text.service';

describe('RateToTextService', () => {
  let service: RateToTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateToTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
