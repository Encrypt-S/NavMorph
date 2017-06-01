import { Component, OnInit, Input } from '@angular/core';

import { ChangellyApiService } from '../../services/changelly-api/changelly-api';

@Component({
  selector: 'send-coins-form-component',
  templateUrl: './send-coins-form.component.html',
  styleUrls: ['./send-coins-form.component.scss'],
  providers: [ ChangellyApiService ],
})
export class SendCoinsFormComponent implements OnInit {

  @Input() theme: string;

  currencies: object;
  errorMessage: string;

  constructor(private changellyApi: ChangellyApiService) {
    if(!this.theme){
      this.theme = 'form-dark'
    }
  }

  ngOnInit() {
    this.getCurrencies()
  }

  getCurrencies() {
    this.changellyApi.getCurrencies()
      .subscribe(
        currencies => {
          // @TODO check data for correct format and display view error if wrong
          this.currencies = currencies;
        },
        error => this.errorMessage = <any>error)
  }
}
