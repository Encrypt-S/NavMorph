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

  waitTimeLow: string
  waitTimeHigh: string

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
        this.orderData = data[0]
        this.orderSuccess = true
        this.fillData(this.orderData)
      } else {
        this.orderFail = true
      }
      this.isLoading = false
    })
  }

  fillData(data) {
    this.orderAmount = data.order_amount
    this.changellyAddress = data.changelly_address_one
    this.orderStatus = data.order_status
    this.estFee = "10 NAV"
    this.sourceCurrency = data.input_currency
    this.destCurrency = data.output_currency
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
}
