import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { OrderService } from '../../services/order/order'
import { GenericFunctionsService } from '../../services/generic-functions/generic-functions'

@Component({
  selector: 'status-page',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],

  providers: [OrderService, GenericFunctionsService],
})
export class StatusPage implements OnInit {
  isLoading: boolean = true
  orderId: string
  orderData: object

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
    private OrderService: OrderService,
    private GenericFuncs: GenericFunctionsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.parseUrl(this.router.url)
    this.getOrderData()
  }

  parseUrl(url: string) {
    const split = url.split('/')
    this.orderId = split[2]
  }

  getOrderData() {
    this.OrderService.getOrder(this.orderId).subscribe(res => {
      if (res.errors && res.errors[0]) {
        if (res.errors[0].code === 'GET_ORDER_UNAUTHORIZED') {
          this.ipBlocked = true
          this.isLoading = false
          return
        }
      }
      this.orderData = res.data
      this.orderSuccess = true
      this.fillData(res.data.order, res.data.eta)
      this.isLoading = false
    })
  }

  fillData(order, eta) {
    this.orderAmount = order.order_amount
    this.changellyAddress = order.changelly_address_one
    this.orderStatus = order.order_status
    this.changellyOrderNumber = order.changelly_id
    this.estFee = '10 NAV'
    this.sourceCurrency = order.input_currency
    this.destCurrency = order.output_currency
    this.waitTimeLow = '' + eta[0] + ' mins'
    this.waitTimeHigh = '' + eta[1] + ' mins'
  }

  abandonOrder() {
    this.beginAbandonOrder = true
    this.orderSuccess = false
    this.abandonStatus = 'Pending'

    this.OrderService.abandonOrder(this.orderId).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.abandonStatus = 'Order sucessfully abandoned. Redirecting to Home Page in 3 seconds'
        setTimeout(() => {
          this.router.navigateByUrl('/')
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
