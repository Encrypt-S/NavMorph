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
  originCoin: string
  destCoin: string
  destAddr: string
  formDataSet: boolean = false

  error = {
    'notFound': false,
    'dataFormat': false,
    'default': false,
  }

  formData: object = {}

  constructor(private changellyApi: ChangellyApiService, private dataServ: SendPageDataService
    ) {
    if(!this.theme){
      this.theme = 'form-dark'
    }
    this.getFormDataStream()
  }

  async ngOnInit() {
    this.getCurrencies()
  }
  getFormData():void {
    this.dataServ.getData()
  }

  getFormDataStream() {
    this.dataServ.getDataStream().subscribe(data => {
      this.formData = data
      this.fillForm(this.formData)
    })
  }

  fillForm(data):void {
    this.transferAmount = data.transferAmount
    this.originCoin = data.originCoin
    this.destCoin = data.destCoin
    this.destAddr = data.destAddr
    if(this.dataServ.isDataSet) {
      setTimeout(() => {
        this.formDataSet = true
      }, 50)
    }
  }

  storeFormData():void {
    this.dataServ.storeData(this.transferAmount, this.originCoin,
      this.destCoin, this.destAddr)
  }

  clearFormData():void {
    this.formData = {}
  }

  getCurrencies() {
    this.changellyApi.getCurrencies()
      .subscribe(
        currencies => {
          if(this.checkCurrData(currencies))
            this.currencies = currencies
            this.isDisabled = false
            this.originCoin = currencies['0']
            this.destCoin = currencies['0']
            this.getFormData()
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
