import { TestBed, inject } from '@angular/core/testing';

import { GenericNodeApiService } from './generic-node-api';

describe('GenericNodeApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenericNodeApiService]
    });
  });

  it('should be created', inject([GenericNodeApiService], (service: GenericNodeApiService) => {
    expect(service).toBeTruthy();
  }));
});
