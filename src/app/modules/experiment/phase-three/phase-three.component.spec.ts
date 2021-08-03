import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseThreeComponent } from './phase-three.component';

describe('PhaseThreeComponent', () => {
  let component: PhaseThreeComponent;
  let fixture: ComponentFixture<PhaseThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
