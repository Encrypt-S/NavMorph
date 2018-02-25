import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { OrderService } from './order';

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';


describe('OrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
      ],
      providers: [
        OrderService,
        GenericNodeApiService,
      ]
    });
  });

  it('should be created', inject([OrderService], (service: OrderService) => {
    expect(service).toBeTruthy();
  }));
});
