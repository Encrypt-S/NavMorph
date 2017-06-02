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
          if(this.checkData(currencies))
            this.currencies = currencies
        },
        error => {
          console.log('err', error)
          this.displayError(error)
        })
  }

  displayError(error){
    let errMsg = ''
    switch(error.slice(0,3)){
      case('404'):
        errMsg = 'Unable to load available currencies from Changelly'
        break
      case('400'):
        errMsg = 'Recevied incorrectly formatted data from Changelly'
      default:
        errMsg = 'Error displaying available currencies'
        break
    }
    this.errorMessage = errMsg
  }


  checkData(data){
    if(data instanceof Array && data[0] instanceof String ){
      this.displayError('400')
      return false
    }
    return true
  }

}
