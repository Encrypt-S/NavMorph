import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'send-coins-section',
  templateUrl: './send-coins.component.html',
  styleUrls: ['./send-coins.component.scss']
})
export class SendCoinsSection implements OnInit {

  coins = [
    { name: 'Nav Coin', ticker: 'NAV' },
    { name: 'Bitcoin', ticker: 'BTC' },
    { name: 'Ethereum', ticker: 'ETH' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
