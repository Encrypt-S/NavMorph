import { TestBed, inject } from '@angular/core/testing';

import { ChangellyApiServiceService } from './changelly-api-service.service';

describe('ChangellyApiServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChangellyApiServiceService]
    });
  });

  it('should be created', inject([ChangellyApiServiceService], (service: ChangellyApiServiceService) => {
    expect(service).toBeTruthy();
  }));
});
