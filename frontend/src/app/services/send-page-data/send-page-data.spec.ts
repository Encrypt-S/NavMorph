import { TestBed, inject, fakeAsync, tick, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { SendPageDataService } from './send-page-data';
import { ChangellyApiService } from '../changelly-api/changelly-api';
import { GenericNodeApiService } from '../generic-node-api/generic-node-api';

import { MockChangellyService } from '../../mock-classes';

describe('SendPageDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SendPageDataService,
        GenericNodeApiService,
        { provide: ChangellyApiService, useClass: MockChangellyService },

    ],
    imports: [HttpClientModule]
    })

    .compileComponents();

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
  })

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

  it('shouldn\'t broadcast data after clearing if told not to', inject([SendPageDataService], (service: SendPageDataService) => {
    this.blankBundle = service.dataBundle
    service.dataBundle = this.testDataBundle //fill with data
    spyOn(service.dataSubject, 'next').and.stub()

    service.clearData(false)

    expect(service.dataBundle).toEqual({errors: []})
    expect(service.dataSubject.next).not.toHaveBeenCalled()
  }));

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

  it('should validate if a databundle\'s transferAmount is too large', inject([SendPageDataService], (service: SendPageDataService) => {
    //transfer amount IS NOT too large
    spyOn(service, 'pushError').and.stub()
    spyOn(service, 'checkAddressIsValid').and.returnValue(true)

    let mockDataBundle = {
      destAddr: 'NavHQ',
      estConvToNav: 0,
      changellyFeeOne: 0,
      errors: []
    }

    service.validateDataBundle(mockDataBundle)
    expect(service.pushError).not.toHaveBeenCalled()

    //transfer amount IS too large
    mockDataBundle.estConvToNav = 99999

    service.validateDataBundle(mockDataBundle)
    expect(service.pushError).toHaveBeenCalledWith(mockDataBundle, 'transferTooLarge')
  }));

  it('should validate if a databundle\'s address is valid', inject([SendPageDataService], (service: SendPageDataService) => {
    spyOn(service, 'pushError').and.stub()
    spyOn(service, 'checkAddressIsValid').and.callFake(
      (str) => {return str ?  true : false})

    let mockDataBundle = {
      destAddr: 'to the moon!',
      estConvToNav: 0,
      changellyFeeOne: 0,
      errors: []
    }

    // destAddr IS valid
    service.validateDataBundle(mockDataBundle)
    expect(service.pushError).not.toHaveBeenCalled()

    // destAddr IS NOT valid
    mockDataBundle.destAddr = undefined
    service.validateDataBundle(mockDataBundle)
    expect(service.pushError).toHaveBeenCalledWith(mockDataBundle, 'invalidDestAddress')
  }));

  it('should be able to push errors onto a databundle', inject([SendPageDataService], (service: SendPageDataService) => {
    //dataBundle has an errors array
    let mockDataBundle = {
      errors: []
    }
    let errMsg = 'someone is pumping and dumping'

    service.pushError(mockDataBundle, errMsg)
    expect(mockDataBundle.errors[0]).toBe(errMsg)

    //dataBundle doesn't have an errors array
    mockDataBundle.errors = undefined
    service.pushError(mockDataBundle, errMsg)
    expect(mockDataBundle.errors[0]).toBe(errMsg)
  }));

  it('should be able to check if an address is valid', inject([SendPageDataService], (service: SendPageDataService) => {
    // address is invalid
    let addr = undefined

    expect(service.checkAddressIsValid(addr)).toBe(false)

    // address is valid
    addr = 'NavHQ'
    expect(service.checkAddressIsValid(addr)).toBe(true)
  }));

  it('should return if errors are found in the submitted form data', inject([SendPageDataService], (service: SendPageDataService) => {
    spyOn(service, 'clearData').and.stub()
    spyOn(service, 'validateFormData').and.stub()
    spyOn(service.dataSubject, 'next').and.stub()
    spyOn(service, 'setIsDataSet').and.callFake( () => service.isDataSet = true)
    service.dataStored = false

    service.dataBundle = {errors: ['error!']}
    let dataBundleAfterStorage = {
      errors: ['error!'],
      transferAmount: 5000,
      originCoin: 'nav',
      destCoin: 'eth',
      destAddr: 'Russia'
    }

    service.storeData( dataBundleAfterStorage.transferAmount, dataBundleAfterStorage.originCoin,
      dataBundleAfterStorage.destCoin, dataBundleAfterStorage.destAddr)

    expect(service.clearData).toHaveBeenCalled()
    expect(service.validateFormData).toHaveBeenCalledWith(dataBundleAfterStorage)
    expect(service.dataSubject.next).toHaveBeenCalledWith(dataBundleAfterStorage)
    expect(service.setIsDataSet).toHaveBeenCalledWith(true)
    expect(service.isDataSet).toBe(true)
    expect(service.dataStored).toBe(true)
  }));

  it('should return if errors are found in the submitted form data', inject([SendPageDataService], (service: SendPageDataService) => {
    spyOn(service, 'clearData').and.stub()
    spyOn(service, 'validateFormData').and.stub()
    spyOn(service, 'estimateFirstExchange').and.stub()

    service.dataStored = false

    service.dataBundle = {errors: []}
    let dataBundleAfterStorage = {
      errors: [],
      transferAmount: 5000,
      originCoin: 'nav',
      destCoin: 'eth',
      destAddr: 'Russia'
    }

    service.storeData( dataBundleAfterStorage.transferAmount, dataBundleAfterStorage.originCoin,
      dataBundleAfterStorage.destCoin, dataBundleAfterStorage.destAddr)

    expect(service.clearData).toHaveBeenCalled()
    expect(service.validateFormData).toHaveBeenCalledWith(dataBundleAfterStorage)
    expect(service.estimateFirstExchange).toHaveBeenCalledWith(dataBundleAfterStorage.originCoin,
      dataBundleAfterStorage.destCoin, dataBundleAfterStorage.transferAmount)
    expect(service.isDataSet).toBe(false)
    expect(service.dataStored).toBe(false)
  }));

// TODO: test error case for getEstimatedExchange
  it('should be able to get an estimated exchange amount', async(inject([SendPageDataService], (service: SendPageDataService) => {
    service.getEstimatedExchange('doge', 'btc', 2).then((data) => {
      expect(data).toBe(5) // MockChangellyService.getEstimatedExchange() returns 5 coins
    })
  })))

  it('should be able to get an estimated exchange amount', async(inject([SendPageDataService], (service: SendPageDataService) => {
    const navCoins = 10
    service.getEstimatedExchange('nav', 'nav', navCoins).then((data) => {
      expect(data).toBe(navCoins)
    })
  })))

// TODO: test error case getMinTransferAmount
  it('should be able to get the minimum transfer amount', async(inject([SendPageDataService], (service: SendPageDataService) => {
    service.getMinTransferAmount('doge', 'btc').then((data) => {
      expect(data).toBe(5) // MockChangellyService.getMinTransferAmount() returns 5 coins
    })
  })))

  // TODO:
  // estimateFirstExchange
  // estimateSecondExchange

});
