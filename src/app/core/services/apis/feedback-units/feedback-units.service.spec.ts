import { TestBed } from '@angular/core/testing';

import { FeedbackUnitsService } from './feedback-units.service';

describe('FeedbackUnitsService', () => {
  let service: FeedbackUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
