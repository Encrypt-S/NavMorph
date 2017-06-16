import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { changellyConstData } from "../config";

import { SendPageDataService } from './send-page-data';
import { ChangellyApiService } from '../../services/changelly-api/changelly-api';
import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';

describe('SendPageDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SendPageDataService,
        ChangellyApiService,
        GenericNodeApiService,
    ],
    imports: [HttpModule]
    });
    this.falsePromise = () => {return new Promise(resolve => resolve(false))}
    this.truePromise = () => {return new Promise(resolve => resolve(true))}

    this.testDataBundle  = {
      'transferAmount': 1,
      'originCoin': 'btc',
      'destCoin': 'doge',
      'destAddr': 'DE5khkYzkxJpH48LG1YbQcM1UPcHye4NC1',
      'estConvToNav': 1000,
      'estConvFromNav': 10000,
      'estNavAfterNavtechFee': 0.005,
      'estTime': 10,
      'changellyFeeTotalToNav': 0.005,
      'navtechFeeTotal': 0.005,
      'changellyFeeTotalFromNav': 0.005,
      'minTransferAmount': 0.00001,
      'errors': []
    }

  });

  it('should be created', inject([SendPageDataService], (service: SendPageDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to clear it\'s data', inject([SendPageDataService], (service: SendPageDataService) => {
    this.blankBundle = service.dataBundle
    service.dataBundle = this.testDataBundle //fill with data
    spyOn(service.dataSubject, 'next').and.stub()

    service.clearData(true)

    expect(service.dataBundle).toEqual({errors: []})
    expect(service.dataSubject.next).toHaveBeenCalledWith(service.dataBundle)
  }));

  // it('should be store data', inject([SendPageDataService], (service: SendPageDataService) => {

  //   service.storeData(this.testData.transferAmount, this.testData.originCoin,
  //     this.testData.destCoin, this.testData.destAddr)

  //   expect(service.transferAmount).toBe(this.testData.transferAmount);
  //   expect(service.originCoin).toBe(this.testData.originCoin);
  //   expect(service.destCoin).toBe(this.testData.destCoin);
  //   expect(service.destAddr).toBe(this.testData.destAddr);
  // }));

  it('should pass data into the dataSubject', inject([SendPageDataService], (service: SendPageDataService) => {
    spyOn(service.dataSubject, 'next').and.stub()

    service.dataBundle = this.testDataBundle
    service.dataStored = false
    service.getData()
    expect(service.dataSubject.next).not.toHaveBeenCalled()

    service.dataStored = true
    service.getData()
    expect(service.dataSubject.next).toHaveBeenCalledWith(service.dataBundle)
  }));

it('should return dataSubject as an Observable', inject([SendPageDataService], (service: SendPageDataService) => {
  this.testDataStream = service.dataSubject.asObservable()
  this.dataStream = service.getDataStream()
  expect(this.dataStream).toEqual(this.testDataStream)
}));

it('should return getDataStatusStream as an Observable', inject([SendPageDataService], (service: SendPageDataService) => {
  this.testDataStream = service.dataSetSubject.asObservable()
  this.dataStream = service.getDataStream()
  expect(this.dataStream).toEqual(this.testDataStream)
}));

it('should tell us if data is set', inject([SendPageDataService], (service: SendPageDataService) => {
  service.isDataSet = true
  expect(service.checkIsDataSet()).toBe(true)
  service.isDataSet = false
  expect(service.checkIsDataSet()).toBe(false)
}));

it('should validate the transferAmount in a the formData is a number', inject([SendPageDataService], (service: SendPageDataService) => {
  spyOn(service, 'getMinTransferAmount').and.returnValue(0)

  //Is a number
  this.testDataBundle.transferAmount = 1
  service.validateFormData(this.testDataBundle)
  expect(this.testDataBundle.errors.indexOf('invalidTransferAmount')).toBe(-1)

  //Not a number
  this.testDataBundle.transferAmount = 'five'
  service.validateFormData(this.testDataBundle)
  expect(this.testDataBundle.errors.indexOf('invalidTransferAmount')).toBe(0)
}));

it('should validate if the the formData has a NAV to NAV transfer', inject([SendPageDataService], (service: SendPageDataService) => {
  spyOn(service, 'getMinTransferAmount').and.returnValue(0)

  //NAV to something
  this.testDataBundle.originCoin = 'nav'
  this.testDataBundle.destCoin = 'doge'
  service.validateFormData(this.testDataBundle)
  expect(this.testDataBundle.errors.indexOf('navToNavTransfer')).toBe(-1)

  //something to NAV
  this.testDataBundle.originCoin = 'doge'
  this.testDataBundle.originCoin = 'nav'
  service.validateFormData(this.testDataBundle)
  expect(this.testDataBundle.errors.indexOf('navToNavTransfer')).toBe(-1)

  //NAV to NAV
  this.testDataBundle.originCoin = 'nav'
  this.testDataBundle.destCoin = 'nav'
  service.validateFormData(this.testDataBundle)
  expect(this.testDataBundle.errors.indexOf('navToNavTransfer')).toBe(0)
}));

it('should validate the transferAmount in the formData is big enough', inject([SendPageDataService], (service: SendPageDataService) => {
  //minTransferAmount is ok
  spyOn(service, 'getMinTransferAmount').and.returnValue(5)
  this.testDataBundle.transferAmount = 10
  service.validateFormData(this.testDataBundle)
  expect(this.testDataBundle.errors.indexOf('transferTooSmall')).toBe(-1)

  //minTransferAmount is not ok
  this.testDataBundle.transferAmount = 1
  service.validateFormData(this.testDataBundle)
  expect(this.testDataBundle.errors.indexOf('transferTooSmall')).toBe(0)
}));

// validateFormData()

// resetDataBundleErrors()

// checkAddressIsValid()

// getMinTransferAmount()

// getEstimatedExchange()

// storeData()
});
