import { Component, OnInit } from '@angular/core';

import { CurrenciesService } from '../../services/currencies';

@Component({
  selector: 'send-coins-section',
  templateUrl: './send-coins.component.html',
  styleUrls: ['./send-coins.component.scss'],
  providers: [ CurrenciesService ]

})
export class SendCoinsSection implements OnInit {

  currencies: object;
  errorMessage: string;

  constructor(private currenciesService: CurrenciesService) { }

  ngOnInit() {
    this.getCurrencies();
  }

  getCurrencies() {
    this.currenciesService.getCurrencies()
      .subscribe(
        currencies => this.currencies = currencies,
        error => this.errorMessage = <any>error);
  }

}
