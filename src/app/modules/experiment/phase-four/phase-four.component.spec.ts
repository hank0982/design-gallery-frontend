import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseFourComponent } from './phase-four.component';

describe('PhaseFourComponent', () => {
  let component: PhaseFourComponent;
  let fixture: ComponentFixture<PhaseFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
