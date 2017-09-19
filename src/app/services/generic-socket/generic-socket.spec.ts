import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { GenericSocketService } from './generic-socket';

describe('GenericSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        GenericSocketService,

      ]
    });
  });

  it('should be created', inject([GenericSocketService], (service: GenericSocketService) => {
    expect(service).toBeTruthy();
  }));

  // it('should extract data from a response')

});
