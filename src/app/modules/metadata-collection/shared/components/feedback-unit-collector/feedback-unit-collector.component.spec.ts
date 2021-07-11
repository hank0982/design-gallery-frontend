import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackUnitCollectorComponent } from './feedback-unit-collector.component';

describe('FeedbackUnitCollectorComponent', () => {
  let component: FeedbackUnitCollectorComponent;
  let fixture: ComponentFixture<FeedbackUnitCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackUnitCollectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackUnitCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
