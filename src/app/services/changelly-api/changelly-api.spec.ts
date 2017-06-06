import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { ChangellyApiService } from './changelly-api';

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';


describe('ChangellyApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
      ],
      providers: [
        ChangellyApiService,
        GenericNodeApiService,
      ]
    });
  });

  it('should be created', inject([ChangellyApiService], (service: ChangellyApiService) => {
    expect(service).toBeTruthy();
  }));
});
