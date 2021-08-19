import { TestBed } from '@angular/core/testing';

import { SidebarControllerService } from './sidebar-controller.service';

describe('SidebarControllerService', () => {
  let service: SidebarControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
