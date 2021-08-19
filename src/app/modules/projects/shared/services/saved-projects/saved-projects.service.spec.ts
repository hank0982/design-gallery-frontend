import { TestBed } from '@angular/core/testing';

import { SavedProjectsService } from './saved-projects.service';

describe('SavedProjectsService', () => {
  let service: SavedProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
