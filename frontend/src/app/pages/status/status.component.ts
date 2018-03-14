import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { OrderService } from '../../services/order/order'
import { SendPageDataService } from '../../services/send-page-data/send-page-data'

@Component({
  selector: 'status-page',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],

  providers: [OrderService, SendPageDataService],
})
export class StatusPage implements OnInit {
  isLoading: boolean = true
  orderId: string

  orderSuccess: boolean
  orderFail: boolean
  ipBlocked: boolean
  beginAbandonOrder: boolean

  orderAmount: string
  changellyAddress: string
  changellyOrderNumber: string
  orderStatus: string
  estFee: string
  sourceCurrency: string
  destCurrency: string
  abandonStatus: string
  isCopied: boolean

  waitTimeLow: string
  waitTimeHigh: string

  constructor(
    private _orderService: OrderService,
    private _router: Router,
    private _dataService: SendPageDataService
  ) {}

  ngOnInit() {
    this.parseUrl(this._router.url)
    this.getOrderData()
  }

  parseUrl(url: string) {
    const split = url.split('/')
    this.orderId = split[2]
  }

  getOrderData() {
    this._orderService.getOrder(this.orderId).subscribe(res => {
      if (res.errors && res.errors[0]) {
        if (res.errors[0].code === 'GET_ORDER_UNAUTHORIZED') {
          this.ipBlocked = true
          this.isLoading = false
          return
        }
      }
      console.log(res);
      
      const feeData = this._dataService.estimateFees(
        res.data.sourceCurrency,
        res.data.destCurrency,
        res.data.order_amount
      )
      const feeEstimate = feeData.estimatedFees
      this.orderSuccess = true
      this.fillData(res.data.order, res.data.eta, feeEstimate)
      this.isLoading = false
    })
  }

  fillData(orderData, eta, feeEstimate) {
    this.orderAmount = orderData.order_amount
    this.changellyAddress = orderData.changelly_address_one
    this.orderStatus = orderData.order_status
    this.changellyOrderNumber = orderData.changelly_id
    this.estFee = feeEstimate
    this.sourceCurrency = orderData.input_currency
    this.destCurrency = orderData.output_currency
    this.waitTimeLow = '' + eta[0] + ' mins'
    this.waitTimeHigh = '' + eta[1] + ' mins'
  }

  abandonOrder() {
    this.beginAbandonOrder = true
    this.orderSuccess = false
    this.abandonStatus = 'Pending'

    this._orderService.abandonOrder(this.orderId).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.abandonStatus = 'Order sucessfully abandoned. Redirecting to Home Page in 3 seconds'
        setTimeout(() => {
          this._router.navigateByUrl('/')
        }, 3000)
      } else {
        this.abandonStatus = 'Failed to Abandon Order'
      }
    })
  }

  interpretStatus(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'Completed'
      case 'ABANDONED':
        return 'Abandoned'
      case 'EXPIRED':
        return 'Expired'
      case 'CREATED':
        return 'Created'
      case 'CONFIRMING':
        return 'Received'
      case 'EXCHANGING':
      case 'SENDING':
        return 'Exchanging'
      case 'FINISHED':
        return 'Sent'
      case 'FAILED':
      case 'REFUNDED':
      default:
        return 'Error'
    }
  }
}
