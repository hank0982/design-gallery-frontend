import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataCollectionComponent } from './metadata-collection.component';

describe('MetadataCollectionComponent', () => {
  let component: MetadataCollectionComponent;
  let fixture: ComponentFixture<MetadataCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
