import { Injectable } from '@angular/core'

import { ChangellyApiService } from '../../services/changelly-api/changelly-api'
import { GenericFunctionsService } from '../../services/generic-functions/generic-functions'
import { changellyConstData, dataBundleTemplate } from "../config"

import { Observable } from 'rxjs'
import { Subject } from 'rxjs/Subject'


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

    this.estimateArrivalTime(originCoin, destCoin, transferAmount)
  }
  
  estimateArrivalTime(originCoin, destCoin, transferAmount) {
    this.getEta(originCoin, destCoin)
      .then((data) => {
        this.dataBundle.eta = data

      this.estimateFirstExchange(originCoin, destCoin, transferAmount)
    })
  }
  
  estimateFirstExchange(originCoin, destCoin, transferAmount) {
    this.getEstimatedExchange(originCoin, 'nav', transferAmount)
      .then((data) => {
        this.dataBundle.estConvToNav = data

        if(originCoin === 'nav'){
          this.dataBundle.changellyFeeOne = 0
        } else {
          this.dataBundle.changellyFeeOne = this.dataBundle.estConvToNav * this.CHANGELLY_FEE
        }

        this.dataBundle.navTechFee = (this.dataBundle.estConvToNav - this.dataBundle.changellyFeeOne) * this.NAVTECH_FEE
        const conversionAfterFees = this.dataBundle.estConvToNav - this.dataBundle.changellyFeeOne - this.dataBundle.navTechFee

        this.estimateSecondExchange(destCoin, conversionAfterFees)
    })
  }

  estimateSecondExchange(destCoin, conversionAfterFees) {
    this.getEstimatedExchange('nav', destCoin, conversionAfterFees)
    .then((data) => {
      this.dataBundle.estConvFromNav = data

      if(destCoin === 'nav'){
        this.dataBundle.changellyFeeTwo = 0
      } else {
        this.dataBundle.changellyFeeTwo = this.dataBundle.estConvFromNav * this.CHANGELLY_FEE
      }

      this.validateDataBundle(this.dataBundle)
      this.dataStored = true
      this.dataSubject.next(this.dataBundle)
      this.setIsDataSet(true)
    })
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

  getEta(originCoin, destCoin) {
    return new Promise<any>( resolve => {
      this.changellyApi.getEta(originCoin, destCoin)
      .subscribe( data => {
        resolve(data)
      }, (err) => {
        resolve (err)
      })
    })
  }

}
