import { TestBed, inject } from '@angular/core/testing';

import { GenericFunctionsService } from './generic-functions';

describe('GenericFunctionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenericFunctionsService, Title]
    });

  });

  it('should be created', inject([GenericFunctionsService], (genericFunctionsService) => {
    expect(genericFunctionsService).toBeTruthy();
  }));

})
