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
  isDisabled: boolean = true
  currencies: object = ['Loading']

  error = {
    'notFound': false,
    'dataFormat': false,
    'default': false,
  }

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
            this.isDisabled = false
        },
        error => {
          this.isDisabled = true
          console.log('err', error)
        })
  }

  toggleFormState(){
  setTimeout(() => {
      this.isDisabled = !this.isDisabled
    }, 100)

  }

  displayError(error){
    switch(error.slice(0,3)){
      case('404'):
        this.error.notFound = true
        break
      case('400'):
        this.error.dataFormat = true
      default:
        this.error.default = true
        break
    }
    this.isDisabled = true
  }


  checkData(data){
    if(data instanceof Array && data[0] instanceof String ){
      this.displayError('400')
      return false
    }
    return true
  }

}
