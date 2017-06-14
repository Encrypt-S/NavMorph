import { Injectable } from '@angular/core';

import { ChangellyApiService } from '../../services/changelly-api/changelly-api';
import { changellyConstData } from "../config";

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SendPageDataService {

  dataStored: boolean = false

  dataBundle =  {
    'transferAmount': undefined,
    'originCoin': undefined,
    'destCoin': undefined,
    'destAddr': undefined,
    'estConvToNav': undefined,
    'estConvFromNav': undefined,
    'estNavAfterNavtechFee': undefined,
    'estTime': undefined,
    'changellyFeeTotalToNav': undefined,
    'navtechFeeTotal': undefined,
    'changellyFeeTotalFromNav': undefined,
    'minTransferAmount': undefined,
    'validData': false,
    'errors': {
      'invalidDestAddress': false,
      'invalidTransferAmount': false,
      'transferTooSmall': false,
      'transferTooLarge': false,
      'navToNavTransfer': false,
      'changellyError': false,
    }
  }

  CHANGELLY_FEE: number = changellyConstData.CHANGELLY_FEE
  NAVTECH_FEE: number = changellyConstData.NAVTECH_FEE
  MAX_NAV_PER_TRADE: number = changellyConstData.MAX_NAV_PER_TRADE

  dataSubject = new Subject<any>()

  dataSetSubject = new Subject<any>()

  isDataSet: boolean = false

  constructor(private changellyApi: ChangellyApiService) { }

  getData(): void {
    if(this.dataStored){
      this.dataSubject.next(this.dataBundle)
    }
  }

  getDataStream(): Observable<any> {
    return this.dataSubject.asObservable()
  }

  getDataStatusStream(): Observable<any> {
    return this.dataSetSubject.asObservable()
  }

  clearData(): void {
    this.dataBundle =  {
      'transferAmount': undefined,
      'originCoin': undefined,
      'destCoin': undefined,
      'destAddr': undefined,
      'estConvToNav': undefined,
      'estConvFromNav': undefined,
      'estNavAfterNavtechFee': undefined,
      'estTime': undefined,
      'changellyFeeTotalToNav': undefined,
      'navtechFeeTotal': undefined,
      'changellyFeeTotalFromNav': undefined,
      'minTransferAmount': undefined,
      'validData': false,
      'errors': {
        'invalidDestAddress': false,
        'invalidTransferAmount': false,
        'transferTooSmall': false,
        'transferTooLarge': false,
        'navToNavTransfer': false,
        'changellyError': false,
      }
    }
    this.dataSubject.next(this.dataBundle)
  }

  checkIsDataSet():boolean {
    return this.isDataSet
  }

  storeData(transferAmount, originCoin, destCoin, destAddr): void {
    this.dataSetSubject.next(false)
    this.resetDataBundleErrors(this.dataBundle)
    this.dataStored = false
    this.dataBundle.transferAmount = Number(transferAmount) ? Number(transferAmount): undefined
    this.dataBundle.originCoin = originCoin
    this.dataBundle.destCoin = destCoin
    this.dataBundle.destAddr = destAddr
    this.dataStored = true
    if(!this.validateFormData(this.dataBundle)) {
      this.dataSubject.next(this.dataBundle)
      return //validation errors, so return early
    }

    this.getEstimatedExchange(originCoin, 'nav', transferAmount)
      .then((data) => {
        if(originCoin === 'nav'){
          this.dataBundle.changellyFeeTotalToNav = 0
        } else {
          this.dataBundle.changellyFeeTotalToNav = transferAmount - transferAmount * this.CHANGELLY_FEE
        }
        this.dataBundle.estConvToNav = this.dataBundle.changellyFeeTotalToNav
        this.dataBundle.navtechFeeTotal = this.dataBundle.estConvToNav - this.dataBundle.estConvToNav * this.NAVTECH_FEE
        this.dataBundle.estNavAfterNavtechFee = this.dataBundle.estConvToNav - this.dataBundle.changellyFeeTotalToNav

        this.getEstimatedExchange('nav', destCoin, this.dataBundle.estNavAfterNavtechFee)
        .then((data) => {
          if(destCoin === 'nav'){
            this.dataBundle.changellyFeeTotalFromNav = 0
          } else {
            this.dataBundle.changellyFeeTotalFromNav = this.dataBundle.estNavAfterNavtechFee - this.dataBundle.estNavAfterNavtechFee * this.CHANGELLY_FEE
          }
          this.dataBundle.estConvFromNav = data
          this.isDataSet = true

          this.validateDataBundle(this.dataBundle)
          .then(() => this.dataSubject.next(this.dataBundle))
        })
    })
  }

  validateFormData(dataBundle):boolean {
    let validData = true
    if(!Number.isInteger(dataBundle.transferAmount)){
      dataBundle.errors.invalidTransferAmount = true
      dataBundle.validData = false
      validData = false
    }
    if(dataBundle.originCoin === 'nav' && dataBundle.destCoin === 'nav') {
      dataBundle.errors.navToNavTransfer = true
      dataBundle.validData = false
      validData = false
    }
    if(dataBundle.transferAmount < this.getMinTransferAmount(dataBundle.originCoin, 'nav')) {
      dataBundle.errors.transferTooSmall = true
      dataBundle.validData = false
      validData = false
    }
    return validData
  }

  validateDataBundle(dataBundle) {
    return new Promise<any>( resolve => {
      if(dataBundle.estNavAfterNavtechFee > this.MAX_NAV_PER_TRADE) {
        dataBundle.errors.transferTooLarge = true
        dataBundle.validData = false
      }
      if(!this.checkAddressIsValid(dataBundle.destAddr)) {
        dataBundle.errors.invalidDestAddress  = true
        dataBundle.validData = false
      }
      // if(changellyError () {
        // dataBundle.errors.changellyError = true
      // }
      resolve()
    })
  }

  resetDataBundleErrors(bundle) {
    bundle.validData = true
    bundle.errors.invalidDestAddress = false
    bundle.errors.invalidTransferAmount = false
    bundle.errors.transferTooSmall = false
    bundle.errors.transferTooLarge = false
    bundle.errors.navToNavTransfer = false
    bundle.errors.changellyError = false
  }

  checkAddressIsValid(address) {
    return address ?  true : false
  }

  getEstimatedExchange(originCoin, destCoin, transferAmount) {
    return new Promise<any>( resolve => {
      if(originCoin === 'nav' && destCoin === 'nav'){
        resolve(transferAmount)
      }
      this.changellyApi.getExchangeAmount(originCoin, destCoin, transferAmount)
      .subscribe( data => {
        resolve(data)
      }, (err) => {
        resolve (err)
      })
    })
  }

  getMinTransferAmount(originCoin, destCoin) {
    return new Promise<any>( resolve => {
      this.changellyApi.getMinAmount(originCoin, destCoin)
      .subscribe( data => {
        resolve(data)
      }, (err) => {
        resolve (err)
      })
    })
  }
}
