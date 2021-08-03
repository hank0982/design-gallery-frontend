import { TestBed } from '@angular/core/testing';

import { PhaseStepService } from './phase-step.service';

describe('PhaseStepService', () => {
  let service: PhaseStepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhaseStepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
