import { Injectable } from '@angular/core';

import { ChangellyApiService } from '../../services/changelly-api/changelly-api';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/first';

@Injectable()
export class SendPageDataService {

  transferAmount: number
  originCoin: string
  destCoin: string
  destAddr: string

  estTime: object
  estConvToNav
  estConvFromNav

  changellyFeeTotalToNav: number
  changellyFeeTotalFromNav: number
  navtechFeeTotal: number
  changellyFee: number = 0.995
  navtechFee: number = 0.995
  MAX_NAV_PER_TRADE: number = 10000

  dataBundle = {
    'transferAmount': undefined,
    'originCoin': undefined,
    'destCoin': undefined,
    'destAddr': undefined,
    'estConvToNav': undefined,
    'estConvFromNav': undefined,
    'changellyFeeTotalToNav': undefined,
    'navtechFeeTotal': undefined,
    'changellyFeeTotalFromNav': undefined,
    'errors': {
      'invalidDestAddress': false,
      'transferTooSmall': false,
      'transferTooLarge': false,
      'navToNavTransfer': false,
      'changellyError': false
    }
  }

  subject = new Subject<any>()

  isDataSet: boolean = false

  constructor(private changellyApi: ChangellyApiService) { }

  getData() {
    this.subject.next(this.dataBundle)
  }

  getDataStream(): Observable<any> {
    return this.subject.asObservable()
  }

  clearData(): void {
    this.transferAmount = undefined
    this.originCoin = undefined
    this.destCoin = undefined
    this.destAddr = undefined
    this.isDataSet = false
  }

  storeData(transferAmount, originCoin, destCoin, destAddr): void {
    this.transferAmount = transferAmount
    this.originCoin = originCoin
    this.destCoin = destCoin
    this.destAddr = destAddr

    this.dataBundle.transferAmount = transferAmount
    this.dataBundle.originCoin = originCoin
    this.dataBundle.destCoin = destCoin
    this.dataBundle.destAddr = destAddr

    this.getEstimatedExchange(originCoin, 'nav', this.transferAmount)
      .then((data) => {
        this.dataBundle.changellyFeeTotalToNav = transferAmount - transferAmount * this.changellyFee
        this.dataBundle.navtechFeeTotal = data - data * this.navtechFee
        this.dataBundle.estConvToNav = data - this.dataBundle.navtechFeeTotal
        this.getEstimatedExchange('nav', destCoin, this.transferAmount)
        .then((data) => {
          this.dataBundle.changellyFeeTotalFromNav = data * this.changellyFee
          this.dataBundle.estConvFromNav = data - this.dataBundle.changellyFeeTotalFromNav
          this.subject.next(this.dataBundle)
          this.isDataSet = true
        })
    })
  }

  validateFormData(dataBundle) {
    if(dataBundle.originCoin === 'nav' && dataBundle.destCoin === 'nav') {
      dataBundle.errors.navToNavTransfer = true
    }
    if(dataBundle.transferAmount < this.getMinTransferAmount(dataBundle.originCoin, 'nav')) {
      dataBundle.errors.transferTooSmall = true
    }
    if(dataBundle.transferAmount > this.MAX_NAV_PER_TRADE) {
      dataBundle.errors.transferTooLarge = true
    }
  }

  getEstimatedExchange(originCoin, destCoin, transferAmount) {
    return new Promise<any>( resolve => {
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
