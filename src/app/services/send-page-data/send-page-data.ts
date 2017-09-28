import { Injectable, OnInit} from '@angular/core'

import { ChangellyApiService } from '../../services/changelly-api/changelly-api'
import { GenericFunctionsService } from '../../services/generic-functions/generic-functions'
import { changellyConstData, dataBundleTemplate } from "../config"

import { Observable } from 'rxjs'
import { Subject } from 'rxjs/Subject'
import BigNumber from 'bignumber.js'

@Injectable()
export class SendPageDataService implements OnInit {

  ngOnInit() {
    BigNumber.config({ DECIMAL_PLACES: 8 })
  }

  dataStored: boolean = false

  dataBundle: dataBundleTemplate = { errors: [] }

  CHANGELLY_FEE: number = changellyConstData.CHANGELLY_FEE
  NAVTECH_FEE: number = changellyConstData.NAVTECH_FEE
  MAX_NAV_PER_TRADE: number = changellyConstData.MAX_NAV_PER_TRADE

  dataSubject = new Subject<any>()

  dataSetSubject = new Subject<any>()

  isDataSet: boolean = false

  previousPageUrl: string

  constructor(private changellyApi: ChangellyApiService) {}

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

  setDataStatus(isSet): void {
    this.isDataSet = isSet
    this.dataSetSubject.next(this.isDataSet)
  }

  clearData(broadcastChanges: boolean ): void {
    this.dataBundle =  {errors: []}
    this.setDataStatus('UNSET')
    if(broadcastChanges)
      this.dataSubject.next(this.dataBundle)
  }

  checkIsDataSet(): boolean {
    return this.isDataSet
  }

  storeData(transferAmount, originCoin, destCoin, destAddr): void {
    this.clearData(false)
    this.setDataStatus('LOADING')
    this.dataStored = false
    try {
      this.dataBundle.transferAmount = new BigNumber(transferAmount, 10).round(8).toString()
    } catch (e) {
      this.dataBundle.transferAmount = undefined
    }
    this.dataBundle.originCoin = originCoin
    this.dataBundle.destCoin = destCoin
    this.dataBundle.destAddr = destAddr
    this.validateFormData(this.dataBundle)
    if(this.dataBundle.errors.length > 0) {
      this.dataStored = true
      this.dataSubject.next(this.dataBundle)
      this.setDataStatus('SET')
      return //validation errors, so return early
    }
    this.estimateFees(originCoin, destCoin, transferAmount)
  }

  estimateFees(originCoin, destCoin, transferAmount) {

    if (originCoin === 'NAV' || destCoin === 'NAV') {
      this.dataBundle.changellyFeeOne = new BigNumber(0)

      this.dataBundle.estimatedFees = (new BigNumber(transferAmount, 10)
                                        .minus((new BigNumber(transferAmount, 10)
                                        .times(new BigNumber(1 - this.NAVTECH_FEE))
                                        .times(new BigNumber(1 - this.CHANGELLY_FEE)))))
                                        .round(8).toString()
    } else {
      this.dataBundle.changellyFeeOne = new BigNumber(transferAmount, 10)
                                        .minus((new BigNumber(transferAmount, 10).times(new BigNumber(1 - this.NAVTECH_FEE))
                                        .times(new BigNumber(1 - this.CHANGELLY_FEE))))
                                        .round(8)

      this.dataBundle.estimatedFees = (new BigNumber(transferAmount, 10)
                                        .minus((new BigNumber(transferAmount, 10).times(new BigNumber(1 - this.NAVTECH_FEE))
                                        .times(new BigNumber(1 - this.CHANGELLY_FEE))
                                        .times((1 - this.CHANGELLY_FEE)))))
                                        .round(8).toString()
      }
    this.estimateArrivalTime(originCoin, destCoin, transferAmount)
  }
  
  estimateArrivalTime(originCoin, destCoin, transferAmount) {
    this.getEta(originCoin, destCoin)
      .then((data) => {
        this.dataBundle.estTime = data

      this.estimateFirstExchange(originCoin, destCoin, transferAmount)
    })
  }
  
  estimateFirstExchange(originCoin, destCoin, transferAmount) {
    if (originCoin === 'NAV') {
      this.dataBundle.estConvToNav = new BigNumber(transferAmount, 10)
      const conversionAfterFees = new BigNumber(this.dataBundle.estConvToNav, 10).times(1 - this.NAVTECH_FEE).round(8)
      this.estimateSecondExchange(destCoin, conversionAfterFees)
    } else {
      this.getEstimatedExchange(originCoin, 'NAV', transferAmount)
        .then((data) => {
          this.dataBundle.estConvToNav = new BigNumber(data, 10).round(8)

          const conversionAfterFees = new BigNumber(this.dataBundle.estConvToNav, 10).times(1 - this.NAVTECH_FEE).round(8)

          this.estimateSecondExchange(destCoin, conversionAfterFees)
      })
    }      
  }

  estimateSecondExchange(destCoin, conversionAfterFees) {
    if (destCoin === 'NAV') {
      this.dataBundle.estConvFromNav = new BigNumber(conversionAfterFees, 10).toString()
      this.sendData()
    } else {
     this.getEstimatedExchange('NAV', destCoin, conversionAfterFees.toString())
      .then((data) => {
        this.dataBundle.estConvFromNav = new BigNumber(data, 10).round(8).toString()
        this.sendData()
      })
    }
  }


  sendData(){
    this.validateDataBundle(this.dataBundle)
    this.dataBundle.changellyFeeOne = this.dataBundle.changellyFeeOne.toString()
    this.dataBundle.estConvToNav = this.dataBundle.estConvToNav.toString()
    this.dataStored = true
    this.dataSubject.next(this.dataBundle)
    this.setDataStatus('SET')
  }

  validateFormData(dataBundle): void {
    if(dataBundle.transferAmount === undefined){
      this.pushError(dataBundle, 'INVALID_TRANSFER_AMOUNT')
      return // If we don't have a number we can't do the test for the next error
    }
    if(dataBundle.originCoin === 'NAV' && dataBundle.destCoin === 'NAV') {
      this.pushError(dataBundle, 'NAV_TO_NAV_TRANSFER')
    }
    this.getMinTransferAmount(dataBundle.originCoin, 'NAV')
    .then((minAmount) => {
      if(new BigNumber(dataBundle.transferAmount, 10).lessThan(new BigNumber(minAmount, 10))) {
        this.pushError(dataBundle, 'TRANSFER_TOO_SMALL')
        dataBundle.minTransferAmount = new BigNumber(minAmount, 10).round(8).toString()
      }
    })
  }

  validateDataBundle(dataBundle) {
    if((dataBundle.estConvToNav.minus(dataBundle.changellyFeeOne)).greaterThan(this.MAX_NAV_PER_TRADE)) {
      this.pushError(dataBundle, 'TRANSFER_TOO_LARGE')
    }
    if(!this.checkAddressIsValid(dataBundle.destAddr)) {
      this.pushError(dataBundle, 'INVALID_DEST_ADDRESS')
    }
    // if(changellyError () {
      // this.pushError(dataBundle, 'CHANGELLY_ERROR')
    // }
  }

 pushError(dataBundle, error): void {
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
      if(originCoin === 'NAV' && destCoin === 'NAV'){
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
