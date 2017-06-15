import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SendPageDataService } from '../../services/send-page-data/send-page-data';
import { ChangellyApiService } from '../../services/changelly-api/changelly-api';

import { changellyConstData } from "../../services/config";

@Component({
  selector: 'status-component',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  transferAmount: number
  originCoin: string
  destCoin: string
  destAddr: string
  formDataSet: boolean = false

  estTime: object
  estConvToNav: number
  estConvFromNav: number

  changellyFeeOne: number
  changellyFeeTwo: number
  navTechFee: number
  formData: object = {}
  MAX_NAV_PER_TRADE = changellyConstData.MAX_NAV_PER_TRADE

  formDataSubscrip: Subscription


  constructor(private dataServ: SendPageDataService ) {
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
    this.dataServ.getDataStatusStream().subscribe(dataIsSet => {
      this.formDataSet = dataIsSet
    })
  }

  updateComponent(formData):void {
    this.transferAmount = formData.transferAmount
    this.originCoin = formData.originCoin
    this.destCoin = formData.destCoin
    this.destAddr = formData.destAddr
    this.estConvToNav = formData.estConvToNav
    this.estConvFromNav = formData.estConvFromNav
    this.changellyFeeOne = formData.changellyFeeOne
    this.navTechFee = formData.navTechFee
    this.changellyFeeTwo= formData.changellyFeeTwo
    this.formDataSet = true
  }
}
