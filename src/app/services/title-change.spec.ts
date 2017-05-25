import { TestBed, inject } from '@angular/core/testing';

import { TitleChangeService } from './title-change';

describe('TitleChangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleChangeService]
    });
  });

  it('should be created', inject([TitleChangeService], (service: TitleChangeService) => {
    expect(service).toBeTruthy();
  }));
});
