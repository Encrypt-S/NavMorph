import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'demo-page',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoPage implements OnInit {

  coins = [
    { name: 'Nav Coin', ticker: 'NAV' },
    { name: 'Bitcoin', ticker: 'BTC' },
    { name: 'Ethereum', ticker: 'ETH' },
  ];

  constructor() { }

  ngOnInit() {
  }
}
