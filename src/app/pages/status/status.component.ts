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
      console.log(data)
      console.log(data[0])
      this.orderData = data[0]
      this.isLoading = false
    })
  }
}
