import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SendPageDataService } from '../../services/send-page-data/send-page-data';
import { ChangellyApiService } from '../../services/changelly-api/changelly-api';


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
  estConvToNav
  estConvFromNav

  changellyFeeTotalToNav: number
  changellyFeeTotalFromNav: number
  navtechFeeTotal: number
  changellyFee: number = 0.995
  navFeeMultiplier: number = 0.995
  MAX_NAV_PER_TRADE: number = 10000

  formData: object = {}

  formDataSubscrip: Subscription


  constructor(private dataServ: SendPageDataService ) {
    this.getFormDataStream()
  }

  ngOnInit() {
    this.getFormData()
  }

  getFormData() {
    this.dataServ.getData()
  }

  getFormDataStream() {
    this.dataServ.getDataStream().subscribe(data => {
      this.formData = data
      this.updateComponent(this.formData)
    })
  }

  updateComponent(data):void {
    this.transferAmount = data.transferAmount
    this.originCoin = data.originCoin
    this.destCoin = data.destCoin
    this.destAddr = data.destAddr
    this.estConvToNav = data.estConvToNav
    this.estConvFromNav = data.estConvFromNav
    this.changellyFeeTotalToNav= data.changellyFeeTotalToNav
    this.navtechFeeTotal= data.navtechFeeTotal
    this.changellyFeeTotalFromNav= data.changellyFeeTotalFromNav
    this.formDataSet = true
  }
}
