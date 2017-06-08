import { Injectable } from '@angular/core';

@Injectable()
export class SendPageDataService {

  public transferAmount: number
  public originCoin: string
  public destCoin: string
  public destAddr: string

  public isDataSet: boolean = false

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
  }

  getData(): object {
    return {
      'transferAmount': this.transferAmount,
      'originCoin': this.originCoin,
      'destCoin': this.destCoin,
      'destAddr': this.destAddr
    }
  }
}
