import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseTwoComponent } from './phase-two.component';

describe('PhaseTwoComponent', () => {
  let component: PhaseTwoComponent;
  let fixture: ComponentFixture<PhaseTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
