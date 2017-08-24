import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order/order'
import { QRCodeModule } from 'angular2-qrcode';


@Component({
  selector: 'status-page',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],

  providers: [
    OrderService,
  ],
})
export class StatusPage implements OnInit {

  isLoading: boolean = true
  orderId: string
  orderPass: string
  orderData: object

  orderSuccess: boolean
  orderFail: boolean
  beginAbandonOrder: boolean

  orderAmount: string
  changellyAddress: string
  orderStatus: string
  estFee: string
  sourceCurrency: string
  destCurrency: string
  abandonStatus: string
  isCopied: boolean

  waitTimeLow: number
  waitTimeHigh: number

  constructor(
    private OrderService: OrderService,
    private router: Router,
   ) {}

  ngOnInit() {
    this.parseUrl(this.router.url)
    this.getOrderData()
  }

  parseUrl (url: string){
    const split = url.split('/')
    this.orderId = split[2]
    this.orderPass = split[3]
  }

  getOrderData() {
    this.OrderService.getOrder(this.orderId, this.orderPass)
    .subscribe(data => {
      if (data[0]) {
        this.orderSuccess = true
        this.fillData(data)
      } else {
        this.orderFail = true
      }
      this.isLoading = false
    })
  }

  fillData(data) {
    const mainData = data[0][0]
    const minMax = data[1]
    this.orderAmount = mainData.order_amount
    this.changellyAddress = mainData.changelly_address_one
    this.orderStatus = mainData.order_status
    this.estFee = "10 NAV"
    this.sourceCurrency = mainData.input_currency
    this.destCurrency = mainData.output_currency
    this.waitTimeLow = minMax[0]
    this.waitTimeHigh = minMax[1]
  }

  abandonOrder() {
    this.beginAbandonOrder = true
    this.orderSuccess = false
    this.abandonStatus = 'Pending'

    this.OrderService.abandonOrder(this.orderId, this.orderPass)
    .subscribe(data => {
      console.log(data)
      if (data.status === 'SUCCESS') {
        this.abandonStatus = 'Order sucessfully abandoned. Redirecting to Home Page in 3 seconds'
        setTimeout(()=>{ this.router.navigateByUrl('/') } , 3000)
      } else {
        this.abandonStatus = 'Failed to Abandon Order'
      }
    })
  }

  calculateOrderEst() {
    this.waitTimeLow = 20
    this.waitTimeHigh = 40
  }
}
