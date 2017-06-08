import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChangellyApiService } from '../../services/changelly-api/changelly-api';
import { SendPageDataService } from '../../services/send-page-data/send-page-data';

@Component({
  selector: 'send-coins-form-component',
  templateUrl: './send-coins-form.component.html',
  styleUrls: ['./send-coins-form.component.scss'],

  providers: [
    FormsModule,
    ChangellyApiService,
  ],
})
export class SendCoinsFormComponent implements OnInit {

  @Input() theme: string;
  isDisabled: boolean = true
  currencies: object = ['Loading']

  transferAmount: number
  selectedOrigin: string
  selectedDest: string
  destAddr: string

  error = {
    'notFound': false,
    'dataFormat': false,
    'default': false,
  }

  formData: object = {}

  constructor(private changellyApi: ChangellyApiService, private dataServ: SendPageDataService) {
    if(!this.theme){
      this.theme = 'form-dark'
    }
  }

  async ngOnInit() {
    this.getCurrencies().then(()=> {
      this.formData = this.getFormData()
      this.fillForm(this.formData)
    })
  }

  getFormData():object {
    return this.dataServ.getData()
  }

  fillForm(data):void {
    this.transferAmount = data.transferAmount
    this.selectedOrigin = data.originCoin
    this.selectedDest = data.destCoin
    this.destAddr = data.destAddr
  }

  setFormData():void {
    this.dataServ.storeData(this.transferAmount, this.selectedOrigin,
      this.selectedDest, this.destAddr)
  }

  clearFormData():void {
    this.transferAmount = undefined
    this.selectedOrigin = undefined
    this.selectedDest = undefined
    this.destAddr = undefined
  }

  getCurrencies() {
    this.changellyApi.getCurrencies()
      .subscribe(
        currencies => {
          if(this.checkCurrData(currencies))
            this.currencies = currencies
            this.isDisabled = false
        },
        error => {
          this.isDisabled = true
          console.log('err', error)
        })
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  toggleFormState() {
  setTimeout(() => {
      this.isDisabled = !this.isDisabled
    }, 100)

  }

  displayError(error) {
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


  checkCurrData(data) {
    if(data instanceof Array && data[0] instanceof String ){
      this.displayError('400')
      return false
    }
    return true
  }
}
