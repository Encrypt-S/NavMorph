import { Injectable } from '@angular/core';

@Injectable()
export class SendPageDataService {

  public transferAmount: number
  public originCoin: string
  public destCoin: string
  public destAddr: string

  constructor() { }


  clearData(): void {
    this.transferAmount = undefined
    this.originCoin = undefined
    this.destCoin = undefined
    this.destAddr = undefined
  }

  storeData(transferAmount, originCoin, destCoin, destAddr): void {
    this.transferAmount = transferAmount
    this.originCoin = originCoin
    this.destCoin = destCoin
    this.destAddr = destAddr
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
