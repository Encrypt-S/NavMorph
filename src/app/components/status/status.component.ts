import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SendPageDataService } from '../../services/send-page-data/send-page-data';
import { ChangellyApiService } from '../../services/changelly-api/changelly-api';
import { GenericFunctionsService } from '../../services/generic-functions/generic-functions';

import { changellyConstData } from "../../services/config";
import BigNumber from 'bignumber.js'


@Component({
  selector: 'status-component',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  transferAmount: string
  originCoin: string
  destCoin: string
  destAddr: string
  formDataStatus: string = 'unset'
  statusUntouched: boolean = true

  estConvToNav: string
  estConvFromNav: string
  etaMin: string
  etaMax: string

  estimatedFees: string
  formData: object = {}
  MAX_NAV_PER_TRADE = changellyConstData.MAX_NAV_PER_TRADE

  formDataSubscrip: Subscription


  constructor(
    private dataServ: SendPageDataService,
    private genFuncs: GenericFunctionsService,
   ) {
    this.getDataStatusStream()
    this.getFormDataStream()
  }

  ngOnInit() {
  }

  getFormDataStream() {
    this.dataServ.getDataStream().subscribe(data => {
      this.formData = data
      this.updateComponent(this.formData)
    })
  }

  getDataStatusStream() {
    this.dataServ.getDataStatusStream().subscribe(dataStatus => {
      this.formDataStatus = dataStatus
    })
  }

  updateComponent(formData):void {
    this.transferAmount = this.formatNumber(formData.transferAmount.toString())
    this.originCoin = formData.originCoin
    this.destCoin = formData.destCoin
    this.destAddr = formData.destAddr
    this.estConvToNav = formData.estConvToNav
    this.estConvFromNav = this.formatNumber(formData.estConvFromNav)
    this.estimatedFees = this.formatNumber(formData.estimatedFees)
    this.etaMin = this.genFuncs.calculateOrderEst(formData.estTime[0]).toLocaleString()
    this.etaMax = this.genFuncs.calculateOrderEst(formData.estTime[1]).toLocaleString()
  }

  formatNumber(numberStr) {
    if( numberStr.indexOf('.') > -1) {
      const splitArr = numberStr.split('.')

      let firstString = splitArr[0].toString()  
      let secondString = splitArr[1].toString()

      firstString = this.insertComma(firstString)
      
      return firstString + '.' + secondString
    } else {
      return this.insertComma(numberStr)
    }
  }

  insertComma(str) {
    const length = str.length
    let modifiedStr = str
    for (var i = length; i >= 1; i = i-3) {
      if (i <= 3) {
        break
      } 
      modifiedStr =  modifiedStr.slice(0, i-3) + ',' +  modifiedStr.slice(i-3)  
    }
    return modifiedStr
  }
}
