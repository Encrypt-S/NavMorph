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
      if (formData.errors.length === 0) {
        this.updateComponent(this.formData)
      }
    })
  }

  getDataStatusStream() {
    this.dataServ.getDataStatusStream().subscribe(dataStatus => {
      this.formDataStatus = dataStatus
    })
  }

  updateComponent(formData):void {
    this.transferAmount = formData.transferAmount
    this.originCoin = formData.originCoin
    this.destCoin = formData.destCoin
    this.destAddr = formData.destAddr
    this.estConvToNav = formData.estConvToNav
    this.estConvFromNav = formData.estConvFromNav
    this.estimatedFees = formData.estimatedFees
    this.etaMin = formData.estTime[0]
    this.etaMax = formData.estTime[1]
  }
}
