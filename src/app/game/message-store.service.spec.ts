import { TestBed, inject } from '@angular/core/testing';

import { MessageStoreService } from './message-store.service';

describe('MessageStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageStoreService]
    });
  });

  it('should be created', inject([MessageStoreService], (service: MessageStoreService) => {
    expect(service).toBeTruthy();
  }));
});
