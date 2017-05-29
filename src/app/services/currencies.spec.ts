import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, BaseRequestOptions, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { Observable } from 'rxjs/Observable';

import { CurrenciesService } from './currencies';

describe('CurrenciesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        CurrenciesService,
        { provide: XHRBackend, useClass: MockBackend }
      ],
    });
  });

  it('should be created', inject([CurrenciesService], (service: CurrenciesService) => {
    expect(service).toBeTruthy();
  }));


  it('should fetch the data',
    inject([CurrenciesService, XHRBackend], (service: CurrenciesService, mockBackend) => {
      const mockResponse = {
        data: [
          { ticker: 'NAV', name: 'Nav Coin' },
          { ticker: 'BTC', name: 'Bitcoin' },
          { ticker: 'ETH', name: 'Ethereum' },
          { ticker: 'LTC', name: 'Litecoin' },
        ]
      };
       mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      })
      service.getCurrencies()
        .subscribe(
          currencies => {
            expect(currencies).toEqual(mockResponse.data)
          },
          error => {})
  }));
  it('should fail to fetch the data',
    inject([CurrenciesService, XHRBackend], (service: CurrenciesService, mockBackend) => {
      const mockResponse = {
        data: [
          { ticker: 'NAV', name: 'Nav Coin' },
          { ticker: 'BTC', name: 'Bitcoin' },
          { ticker: 'ETH', name: 'Ethereum' },
          { ticker: 'LTC', name: 'Litecoin' },
        ]
      };
       mockBackend.connections.subscribe((connection) => {
        connection.mockError(new Response(new ResponseOptions({
          status: 502,
          body: JSON.stringify(mockResponse)
        })));
      })
      service.getCurrencies()
        .subscribe(
          currencies => {},
          error => {
            expect(error).toBe(error)
          })
  }));

});
