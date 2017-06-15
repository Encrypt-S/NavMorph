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
  originCoin: any
  destCoin: any
  destAddr: string
  formDataSet: boolean = false

  minTransferAmount: number

  errors = {
      'notFound': false,
      'dataFormat': false,
      'default': false,
      'invalidDestAddress': false,
      'invalidTransferAmount': false,
      'navToNavTransfer': false,
      'changellyError': false,
    }

  formData: object = {}

  constructor(
    private changellyApi: ChangellyApiService,
    private dataServ: SendPageDataService,
  ) {
    if(!this.theme){
      this.theme = 'form-dark'
    }
    this.getFormDataStream()
  }

  ngOnInit() {
    this.getCurrencies()
  }

  getFormData():void {
    this.dataServ.getData()
  }

  getFormDataStream() {
    this.dataServ.getDataStream().subscribe(data => {
      this.resetErrors(this.errors)
      this.formData = data
      this.checkErrors(data.errors)
      this.fillForm(this.formData)
    })
  }

  sendForm():void {
    this.storeFormData()
  }

  storeFormData():void {
    let originCoin = this.originCoin
    let destCoin = this.destCoin

    if (!originCoin) {
        originCoin = this.currencies['0']
    }
    if (!destCoin) {
        destCoin = this.currencies['0']
    }
    this.dataServ.storeData(this.transferAmount, originCoin, destCoin, this.destAddr)
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

  clearFormData():void {
    this.transferAmount = undefined
    this.destAddr = undefined
    this.originCoin = this.currencies[0]
    this.destCoin = this.currencies[0]
    this.errors = undefined
  }

  getCurrencies() {
    this.changellyApi.getCurrencies()
      .subscribe(
        currencies => {
          if(this.checkCurrData(currencies))
            this.currencies = currencies
            this.isDisabled = false
            this.getFormData()
        },
        error => {
          this.isDisabled = true
          console.log('err', error)
        })
  }

  toggleFormState() {
    setTimeout(() => {
      this.isDisabled = !this.isDisabled
    }, 100)
  }

  checkErrors(errorBundle) {
    if(errorBundle.indexOf('invalidDestAddress') > -1) {
      this.errors.invalidDestAddress = true
    }
    if(errorBundle.indexOf('invalidTransferAmount') > -1 || errorBundle.indexOf('transferTooSmall') > -1 || errorBundle.indexOf('transferTooLarge') > -1 ) {
      this.errors.invalidTransferAmount = true
    }
    if(errorBundle.indexOf('navToNavTransfer') > -1) {
      this.errors.navToNavTransfer = true
    }
    if(errorBundle.indexOf('changellyError') > -1) {
      this.errors.changellyError = true
    }
  }

  resetErrors(errors) {
    errors.notFound = false
    errors.dataFormat = false
    errors.default = false
    errors.invalidDestAddress = false
    errors.invalidTransferAmount = false
    errors.navToNavTransfer = false
    errors.changellyError = false
  }

  displayError(error) {
    switch(error.slice(0,3)){
      case('404'):
        this.errors.notFound = true
        break
      case('400'):
        this.errors.dataFormat = true
      default:
        this.errors.default = true
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
