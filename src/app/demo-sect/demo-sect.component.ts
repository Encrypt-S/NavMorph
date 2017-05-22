import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-sect',
  templateUrl: './demo-sect.component.html',
  styleUrls: ['./demo-sect.component.scss']
})
export class DemoSectComponent implements OnInit {

  coins = [
    { name: 'Nav Coin', ticker: 'NAV' },
    { name: 'Bitcoin', ticker: 'BTC' },
    { name: 'Ethereum', ticker: 'ETH' },
  ];

  constructor() { }

  ngOnInit() {
  }
}
