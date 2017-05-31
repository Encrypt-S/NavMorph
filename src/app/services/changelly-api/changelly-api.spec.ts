import { TestBed, inject } from '@angular/core/testing';

import { ChangellyApiService } from './changelly-api';

describe('ChangellyApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChangellyApiService]
    });
  });

  it('should be created', inject([ChangellyApiService], (service: ChangellyApiService) => {
    expect(service).toBeTruthy();
  }));
});
