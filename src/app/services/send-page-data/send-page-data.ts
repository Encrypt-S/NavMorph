import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SendPageDataService {

  transferAmount: number
  originCoin: string
  destCoin: string
  destAddr: string

  dataBundle = {
    'transferAmount': this.transferAmount,
    'originCoin': this.originCoin,
    'destCoin': this.destCoin,
    'destAddr': this.destAddr
  }

  subject = new Subject<any>()

  isDataSet: boolean = false

  constructor() { }

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
    this.isDataSet = true

    this.dataBundle.transferAmount = transferAmount
    this.dataBundle.originCoin = originCoin
    this.dataBundle.destCoin = destCoin
    this.dataBundle.destAddr = destAddr

    this.subject.next(this.dataBundle)
  }

  getData() {
    this.subject.next(this.dataBundle)
  }

  getDataStream(): Observable<any> {
    return this.subject.asObservable()
  }
}
