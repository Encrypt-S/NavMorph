import { Component, OnInit, Input } from '@angular/core';

import { CurrenciesService } from '../../services/currencies';

@Component({
  selector: 'send-coins-form-component',
  templateUrl: './send-coins-form.component.html',
  styleUrls: ['./send-coins-form.component.scss'],
  providers: [ CurrenciesService ],
})
export class SendCoinsFormComponent implements OnInit {

  @Input() lightTheme: boolean;

  currencies: object;
  errorMessage: string;

  constructor(private currenciesService: CurrenciesService) { }

  ngOnInit() {
    this.getCurrencies()
  }

  getCurrencies() {
    this.currenciesService.getCurrencies()
      .subscribe(
        currencies => {
          // @TODO check data for correct format and display view error if wrong
          this.currencies = currencies;
        },
        error => this.errorMessage = <any>error)
  }
}
