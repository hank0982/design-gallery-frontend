import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikertInputComponent } from './likert-input.component';

describe('LikertInputComponent', () => {
  let component: LikertInputComponent;
  let fixture: ComponentFixture<LikertInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikertInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikertInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
