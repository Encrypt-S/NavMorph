import { Injectable } from '@angular/core';

import { ChangellyApiService } from '../../services/changelly-api/changelly-api';
import { changellyConstData, dataBundleTemplate } from "../config";

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import * as BigNumber from 'bignumber.js'


@Injectable()
export class SendPageDataService {

  dataStored: boolean = false

  dataBundle: dataBundleTemplate = { errors: [] }

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

  setIsDataSet(isSet):void {
    this.isDataSet = isSet
    this.dataSetSubject.next(this.isDataSet)
  }

  clearData(broadcastChanges:boolean ): void {
    this.dataBundle =  {errors: []}
    this.setIsDataSet(false)
    if(broadcastChanges)
      this.dataSubject.next(this.dataBundle)
  }

  checkIsDataSet():boolean {
    return this.isDataSet
  }

  storeData(transferAmount, originCoin, destCoin, destAddr): void {
    this.clearData(false)
    this.dataStored = false
    this.dataBundle.transferAmount = Number(transferAmount) ? Number(transferAmount): undefined
    this.dataBundle.originCoin = originCoin
    this.dataBundle.destCoin = destCoin
    this.dataBundle.destAddr = destAddr
    this.validateFormData(this.dataBundle)
    if(this.dataBundle.errors.length > 0) {
      this.dataStored = true
      this.dataSubject.next(this.dataBundle)
      this.setIsDataSet(true)
      return //validation errors, so return early
    }

    this.estimateFees(originCoin, destCoin, transferAmount)
  }

  estimateFees(originCoin, destCoin, transferAmount) {

    if (originCoin === 'nav' || destCoin === 'nav') {
      this.dataBundle.estimatedFees = new BigNumber(transferAmount) * (1 - this.NAVTECH_FEE) * (1 - this.CHANGELLY_FEE)
    } else {
      this.dataBundle.estimatedFees = new BigNumber(transferAmount) * (1 - this.NAVTECH_FEE) * (1 - this.CHANGELLY_FEE) * (1 - this.CHANGELLY_FEE)
    }

    this.estimateFirstExchange(originCoin, destCoin, transferAmount)
  }


  estimateFirstExchange(originCoin, destCoin, transferAmount) {
    if (originCoin === 'nav') {
      this.dataBundle.estConvToNav = new BigNumber(transferAmount)
      const conversionAfterFees = new BigNumber(this.dataBundle.estConvToNav) * (1 - this.NAVTECH_FEE)
      this.estimateSecondExchange(destCoin, conversionAfterFees)
    } else {
      this.getEstimatedExchange(originCoin, 'nav', transferAmount)
        .then((data) => {
          this.dataBundle.estConvToNav = new BigNumber(data)

          const conversionAfterFees = new BigNumber(this.dataBundle.estConvToNav) * (1 - this.NAVTECH_FEE)

          this.estimateSecondExchange(destCoin, conversionAfterFees)
      })
    }      
  }

  estimateSecondExchange(destCoin, conversionAfterFees) {
    if (destCoin === 'nav') {
      this.dataBundle.estConvFromNav = new BigNumber(conversionAfterFees)
    } else {
     this.getEstimatedExchange('nav', destCoin, conversionAfterFees)
      .then((data) => {
        this.dataBundle.estConvFromNav = new BigNumber(data)
      })

      this.validateDataBundle(this.dataBundle)
      this.dataStored = true
      this.dataSubject.next(this.dataBundle)
      this.setIsDataSet(true)
    }
  }

  validateFormData(dataBundle):void {
    if(!Number.isInteger(dataBundle.transferAmount)){
      this.pushError(dataBundle, 'invalidTransferAmount')
    }
    if(dataBundle.originCoin === 'nav' && dataBundle.destCoin === 'nav') {
      this.pushError(dataBundle, 'navToNavTransfer')
    }
    if(dataBundle.transferAmount < this.getMinTransferAmount(dataBundle.originCoin, 'nav')) {
      this.pushError(dataBundle, 'transferTooSmall')
    }
  }

  validateDataBundle(dataBundle) {
    if((dataBundle.estConvToNav - dataBundle.changellyFeeOne ) > this.MAX_NAV_PER_TRADE) {
      this.pushError(dataBundle, 'transferTooLarge')
    }
    if(!this.checkAddressIsValid(dataBundle.destAddr)) {
      this.pushError(dataBundle, 'invalidDestAddress')
    }
    // if(changellyError () {
      // this.pushError(dataBundle, 'changellyError')
    // }
  }

 pushError(dataBundle, error):void {
   if(!dataBundle.errors) {
     dataBundle.errors = []
   }
   dataBundle.errors.push(error)
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
