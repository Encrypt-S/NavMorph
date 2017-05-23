import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-trade-sect',
  templateUrl: './trade-sect.component.html',
  styleUrls: ['./trade-sect.component.scss']
})
export class TradeSectComponent implements OnInit {

  constructor() { }

  cryptoCoins = [
    {name: 'BTC', viewValue: 'Steak'},
    {name: 'NAV', viewValue: 'Pizza'},
    {name: 'LTC', viewValue: 'Tacos'}
  ];

  selectedOriginCoin = this.cryptoCoins[0].name;
  selectedDestCoin = this.cryptoCoins[0].name;
  coveretedCoin: string;


  ngOnInit() {

  }

}
