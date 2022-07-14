import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayPreviewComponent } from './replay-preview.component';

describe('ProjectPreviewComponent', () => {
  let component: ReplayPreviewComponent;
  let fixture: ComponentFixture<ReplayPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplayPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplayPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
