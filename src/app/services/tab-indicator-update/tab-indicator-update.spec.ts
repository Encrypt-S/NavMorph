import { TestBed, inject } from '@angular/core/testing';

import { TabIndicatorUpdateService } from './tab-indicator-update';

describe('TabIndicatorUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabIndicatorUpdateService]
    });
  });

  it('should be created', inject([TabIndicatorUpdateService], (service: TabIndicatorUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
