import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangellyApiService } from '../../services/changelly-api/changelly-api';
import { OrderService } from '../../services/order/order';
import { SendPageDataService } from '../../services/send-page-data/send-page-data';
import {Router} from '@angular/router';


@Component({
  selector: 'send-coins-form-component',
  templateUrl: './send-coins-form.component.html',
  styleUrls: ['./send-coins-form.component.scss'],

  providers: [
    FormsModule,
    ChangellyApiService,
    OrderService,
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
  minTransferAmount: number
  estimateValid: boolean = false

  errors = []

  formData: object = {}

  constructor(
    private changellyApi: ChangellyApiService,
    private dataServ: SendPageDataService,
    private orderServ: OrderService,
    private router: Router,
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
      this.errors = []
      this.formData = data
      this.checkErrors(data.errors)
      this.fillForm(this.formData)
    })
  }

  invalidateEstimate() {
    this.estimateValid = false
  }

  sendForm():void {
    this.storeFormData()
  }

  createOrder(originCoin, destCoin, destAddr, transferAmount):void {
    this.orderServ.createOrder(originCoin, destCoin, destAddr, transferAmount).subscribe(
      result => {
        if (result.type === "FAIL" ){
          this.errors.push('orderCreationFailed')
          return
        }

        const statusPageUrl = '/status/' + result.data['0'] + '/' + result.data['1']
        // TODO: Turn on this routing
        console.log(statusPageUrl)
        // this.router.navigateByUrl(statusPageUrl)
      },
      error => {
        console.log('error creating order', error)
        this.errors.push('orderCreationFailed')
      })
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
    this.transferAmount = data.transferAmount ? data.transferAmount : undefined
    this.originCoin = data.originCoin ? data.originCoin : undefined
    this.destCoin = data.destCoin
    this.destAddr = data.destAddr

    if( data.errors.length === 0 ) {
      this.estimateValid = true
      setTimeout(() => {
        this.estimateValid = false
        this.errors.push('expiredEst')
      }, 300000)
    } else {
      this.estimateValid = false
    }
  }

  clearFormData():void {
    this.dataServ.clearData(true)
    this.estimateValid = false
    this.originCoin = this.currencies[0]
    this.destCoin = this.currencies[0]
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
      this.errors.push('invalidDestAddress')
    }
    if(errorBundle.indexOf('invalidTransferAmount') > -1 || errorBundle.indexOf('transferTooSmall') > -1
      || errorBundle.indexOf('transferTooLarge') > -1 ) {
      this.errors.push('invalidTransferAmount')
    }
    if(errorBundle.indexOf('navToNavTransfer') > -1) {
      this.errors.push('navToNavTransfer')
    }
    if(errorBundle.indexOf('changellyError') > -1) {
      this.errors.push('changellyError')
    }
  }

  displayError(error) {
    console.log(error);
    switch(error.slice(0,3)){
      case('404'):
        this.errors.push('notFound')
        break
      case('400'):
        this.errors.push('dataFormat')
      default:
        this.errors.push('default')
        break
    }
    this.isDisabled = true
  }

  checkCurrData(data) {
    if(data instanceof Array && data[0] instanceof String ) {
      console.log(data);
      this.displayError('400')
      return false
    }
    return true
  }
}
