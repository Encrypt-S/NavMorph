import { Injectable, OnDestroy } from '@angular/core'

import { ChangellyApiService } from '../changelly-api/changelly-api'
import { changellyConstData, dataBundleTemplate } from '../config'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import BigNumber from 'bignumber.js'

@Injectable()
export class SendPageDataService implements OnDestroy {
  dataStored: boolean = false
  connection

  dataBundle: dataBundleTemplate = {
    errors: [],
  }

  CHANGELLY_FEE: number = changellyConstData.CHANGELLY_FEE
  NAVTECH_FEE: number = changellyConstData.NAVTECH_FEE
  MAX_NAV_PER_TRADE: number = changellyConstData.MAX_NAV_PER_TRADE

  dataSubject = new Subject<any>()

  dataSetSubject = new Subject<any>()

  dataStatus: string = 'UNTOUCHED'

  previousPageUrl: string

  constructor(private _ChangellyApi: ChangellyApiService) {
    BigNumber.config({ DECIMAL_PLACES: 8 })
  }

  getData(): void {
    if (this.dataStored === true) {
      this.dataSubject.next(this.dataBundle)
    } else {
      this.dataSubject.next({})
    }
  }

  getDataStream(): Observable<any> {
    return this.dataSubject.asObservable()
  }

  getDataStatusStream(): Observable<any> {
    return this.dataSetSubject.asObservable()
  }

  setDataStatus(isSet: string): void {
    this.dataStatus = isSet
    this.dataSetSubject.next(this.dataStatus)
  }

  clearData(broadcastChanges: boolean): void {
    this.dataBundle = { errors: [] }
    this.setDataStatus('UNSET')
    if (broadcastChanges) this.dataSubject.next(this.dataBundle)
  }

  checkDataStatus(): string {
    return this.dataStatus
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
    if (this.dataBundle.errors.length > 0) {
      this.dataStored = true
      this.dataSubject.next(this.dataBundle)
      return //validation errors, so return early
    }
    const fees = this.estimateFees(originCoin, destCoin, transferAmount)
    this.dataBundle.changellyFee = fees.changellyFee
    this.dataBundle.estimatedFees = fees.estimatedFees
    this.estimateArrivalTime(originCoin, destCoin, transferAmount)
  }

  estimateFees(originCoin, destCoin, transferAmount) {
    // TODO pull this out into a more generic service
    let changellyFee
    
    let estimatedFees = '0'
    if (originCoin === 'NAV' || destCoin === 'NAV') {
      changellyFee = new BigNumber(0) // TODO Get actual fee
      estimatedFees = new BigNumber(transferAmount, 10)
        .minus(
          new BigNumber(transferAmount, 10)
          .times(new BigNumber(1 - this.NAVTECH_FEE))
          .times(new BigNumber(1 - this.CHANGELLY_FEE))
        )
        .round(8)
        .toString()
        
    } else {
      changellyFee = new BigNumber(transferAmount, 10)
        .minus(
          new BigNumber(transferAmount, 10)
            .times(new BigNumber(1 - this.NAVTECH_FEE))
            .times(new BigNumber(1 - this.CHANGELLY_FEE))
        )
        .round(8)
      estimatedFees = new BigNumber(transferAmount, 10)
        .minus(
          new BigNumber(transferAmount, 10)
            .times(new BigNumber(1 - this.NAVTECH_FEE))
            .times(new BigNumber(1 - this.CHANGELLY_FEE))
            .times(new BigNumber(1 - this.CHANGELLY_FEE))
        )
        .round(8)
        .toString()
    }
    return { changellyFee, estimatedFees}
  }

  estimateArrivalTime(originCoin, destCoin, transferAmount) {
    this.getEta(originCoin, destCoin)
      .then(res => {
        this.dataBundle.estTime = res.data.eta
        this.estimateFirstExchange(originCoin, destCoin, transferAmount)
      })
      .catch(err => {
        this.dataBundle.errors.push('ETA_ERROR')
      })
  }

  estimateFirstExchange(originCoin, destCoin, transferAmount) {
    if (originCoin === 'NAV') {
      this.dataBundle.estConvToNav = new BigNumber(transferAmount, 10)
      const conversionAfterFees = new BigNumber(this.dataBundle.estConvToNav, 10).times(1 - this.NAVTECH_FEE).round(8)
      this.estimateSecondExchange(destCoin, conversionAfterFees)
    } else {
      this.getEstimatedExchange(originCoin, 'NAV', transferAmount)
        .then(res => {
          this.dataBundle.estConvToNav = new BigNumber(res.data.amount, 10).round(8)

          const conversionAfterFees = new BigNumber(this.dataBundle.estConvToNav, 10)
            .times(1 - this.NAVTECH_FEE)
            .round(8)

          this.estimateSecondExchange(destCoin, conversionAfterFees)
        })
        .catch(err => {
          this.pushError(this.dataBundle, 'CHANGELLY_ERROR')
          this.sendData()
        })
    }
  }

  estimateSecondExchange(destCoin, conversionAfterFees) {
    if (destCoin === 'NAV') {
      this.dataBundle.estConvFromNav = new BigNumber(conversionAfterFees, 10).toString()
      this.sendData()
    } else {
      this.getEstimatedExchange('NAV', destCoin, conversionAfterFees.toString())
        .then(res => {
          this.dataBundle.estConvFromNav = new BigNumber(res.data.amount, 10).round(8).toString()
          this.sendData()
        })
        .catch(err => {
          this.pushError(this.dataBundle, 'CHANGELLY_ERROR')
          this.sendData()
        })
    }
  }

  sendData() {
    this.validateDataBundle(this.dataBundle)
    this.dataBundle.changellyFee = this.dataBundle.changellyFee.toString() || undefined
    this.dataBundle.estConvToNav = this.dataBundle.estConvToNav.toString() || undefined
    this.dataStored = true
    this.dataSubject.next(this.dataBundle)
  }

  validateFormData(dataBundle): void {
    if (dataBundle.transferAmount === undefined) {
      this.pushError(dataBundle, 'INVALID_TRANSFER_AMOUNT')
      return // If we don't have a number we can't do the test for the next error
    }
    if (dataBundle.originCoin === 'NAV' && dataBundle.destCoin === 'NAV') {
      this.pushError(dataBundle, 'NAV_TO_NAV_TRANSFER')
    }
    this.getMinTransferAmount(dataBundle.originCoin, 'NAV')
      .then(minAmount => {
        if (new BigNumber(dataBundle.transferAmount, 10).lessThan(new BigNumber(minAmount, 10))) {
          this.pushError(dataBundle, 'TRANSFER_TOO_SMALL')
          dataBundle.minTransferAmount = new BigNumber(minAmount, 10).round(8).toString()
        }
      })
      .catch(err => {
        this.pushError(dataBundle, 'CHANGELLY_ERROR')
      })
  }

  validateDataBundle(dataBundle) {
    if (dataBundle.estConvToNav.minus(dataBundle.changellyFee).greaterThan(this.MAX_NAV_PER_TRADE)) {
      this.pushError(dataBundle, 'TRANSFER_TOO_LARGE')
    }
    if (!this.checkAddressIsValid(dataBundle.destAddr)) {
      this.pushError(dataBundle, 'INVALID_DEST_ADDRESS')
    }
  }

  pushError(dataBundle, error): void {
    if (!dataBundle.errors) {
      dataBundle.errors = []
    }
    dataBundle.errors.push(error)
  }

  checkAddressIsValid(address) {
    return address ? true : false
  }

  getEstimatedExchange(originCoin, destCoin, transferAmount) {
    return new Promise<any>((resolve, reject) => {
      if (originCoin === 'NAV' && destCoin === 'NAV') {
        resolve(transferAmount)
      }
      this._ChangellyApi.getExchangeAmount(originCoin, destCoin, transferAmount).subscribe(
        data => {
          resolve(data)
        },
        err => {
          reject(err)
        }
      )
    })
  }

  getMinTransferAmount(originCoin, destCoin) {
    return new Promise<any>((resolve, reject) => {
      this._ChangellyApi.getMinAmount(originCoin, destCoin).subscribe(
        res => {
          resolve(res.data.minAmount)
        },
        err => {
          reject(err)
        }
      )
    })
  }

  getEta(originCoin, destCoin) {
    return new Promise<any>((resolve, reject) => {
      this._ChangellyApi.getEta(originCoin, destCoin).subscribe(
        data => {
          resolve(data)
        },
        err => {
          reject(err)
        }
      )
    })
  }

  ngOnDestroy() {
    this.connection.unsubscribe()
  }
}
