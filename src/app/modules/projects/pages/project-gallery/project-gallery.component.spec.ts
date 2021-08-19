import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectGalleryComponent } from './project-gallery.component';

describe('ProjectGalleryComponent', () => {
  let component: ProjectGalleryComponent;
  let fixture: ComponentFixture<ProjectGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
