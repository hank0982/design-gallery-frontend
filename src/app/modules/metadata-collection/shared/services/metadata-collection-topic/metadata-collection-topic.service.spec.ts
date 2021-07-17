import { TestBed } from '@angular/core/testing';

import { MetadataCollectionTopicService } from './metadata-collection-topic.service';

describe('MetadataCollectionTopicService', () => {
  let service: MetadataCollectionTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataCollectionTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
