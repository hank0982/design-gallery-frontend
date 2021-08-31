import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedProjectRowComponent } from './saved-project-row.component';

describe('SavedProjectRowComponent', () => {
  let component: SavedProjectRowComponent;
  let fixture: ComponentFixture<SavedProjectRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedProjectRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedProjectRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
