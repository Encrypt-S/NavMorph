import { Component, OnInit, Input, OnDestroy} from '@angular/core'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { ChangellyApiService } from '../../services/changelly-api/changelly-api'
import { OrderService } from '../../services/order/order'
import { SendPageDataService } from '../../services/send-page-data/send-page-data'
import { GenericSocketService } from '../../services/generic-socket/generic-socket'

import * as io from 'socket.io-client'

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


export class SendCoinsFormComponent implements OnInit, OnDestroy {

  @Input() theme: string
  @Input() loaderTheme: string
  isDisabled: boolean = true
  currencies: object = ['LOADING']
  transferAmount: string
  originCoin: string
  destCoin: string
  destAddr: string
  minTransferAmount: number
  estimateValid: boolean = false
  pageLoading: boolean
  formNotFilled: boolean = true

  errors = []

  formData: object = {}

  private socketUrl = 'https://localhost:3000'
  private socket  
  maintenaceModeActive: boolean = true
  connection

  constructor(
    private changellyApi: ChangellyApiService,
    private dataServ: SendPageDataService,
    private orderServ: OrderService,
    private router: Router,
    private genericSocket: GenericSocketService,
  ) {
    if(!this.theme){
      this.theme = 'form-dark'
    }
  }

  ngOnInit() {
    this.connectToSocket()
    this.getFormDataStream()
    this.getCurrencies()
  }

 ngOnDestroy() {
    this.connection.unsubscribe()
  }

  connectToSocket():void {
    this.connection = this.genericSocket.getMessages(this.socketUrl, 'SERVER_MODE').subscribe((serverMode) => {
      if (serverMode === 'MAINTENANCE') {
        this.maintenaceModeActive = true
      } else {
        this.maintenaceModeActive = false
      }
    })
  }

  setLoadingState(state: boolean):void {
    this.pageLoading = state
  }

  getFormData():void {
    this.dataServ.getData()
  }

  getFormDataStream() {
    this.dataServ.getDataStream().subscribe(data => {
      this.errors = []
      if (Object.keys(data).length > 0) { 
        this.formData = data
        this.checkErrors(data.errors)
        this.fillForm(this.formData)
        this.dataServ.setDataStatus('SET')
        this.checkFormFilled()
        this.setLoadingState(false)
      } else if (this.dataServ.checkDataStatus() === 'UNTOUCHED'){
        this.setLoadingState(false)
      }
    })
  }

  modelUpdated(input: string){
    this.invalidateEstimate()
    let removedError

    if (input === 'AMOUNT') {
      removedError = 'INVALID_TRANSFER_AMOUNT'
    } else if (input === 'INPUT'){
      removedError = 'INVALID_DEST_ADDRESS'
    }

    const tempArray = []
    this.errors.forEach((err) => {
      if (err !== removedError) {
        tempArray.push(err)
      }
    })
    this.errors = tempArray
  }

  invalidateEstimate() {
    this.checkFormFilled()
    this.estimateValid = false
  }

  sendForm():void {
    this.checkFormFilled()
    if(this.formNotFilled) {
      return
    }
    this.storeFormData()
  }

  checkFormFilled():void {
    if(this.transferAmount && this.destAddr) {
      this.formNotFilled = false
    } else {
      this.formNotFilled = true
    }
  }

  createOrder(originCoin, destCoin, destAddr, transferAmount):void {
    this.orderServ.createOrder(originCoin, destCoin, destAddr, transferAmount).subscribe(
      result => {
        if (result.type === "FAIL" ){
          this.errors.push('ORDER_CREATION_FAILED')
          return
        }

        const statusPageUrl = '/status/' + result.data['0'] + '/' + result.data['1']
        this.router.navigateByUrl(statusPageUrl)
      },
      error => {
        console.log('error creating order', error)
        this.errors.push('ORDER_CREATION_FAILED')
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

    if( data.errors.length === 0 && this.dataServ.previousPageUrl === '/') {
      this.estimateValid = true
      setTimeout(() => {
        this.estimateValid = false
        this.errors.push('EXPIRED_EST')
      }, 300000)
    } else {
      this.estimateValid = false
    }
  }

  clearFormData():void {
    this.dataServ.clearData(true)
    this.checkFormFilled()
    this.estimateValid = false
    this.originCoin = this.currencies[0]
    this.destCoin = this.currencies[0]
  }

  getCurrencies() {
    this.setLoadingState(true)
    this.changellyApi.getCurrencies()
      .subscribe(
        currencies => {
          if(this.checkCurrData(currencies))
            this.currencies = this.formatCurrData(currencies)
            this.isDisabled = false
            this.getFormData()
        },
        error => {
          this.isDisabled = true
          console.log('err', error)
          this.setLoadingState(false)
        })
  }

  checkErrors(errorBundle) {
    if(errorBundle.indexOf('INVALID_DEST_ADDRESS') > -1) {
      this.errors.push('INVALID_DEST_ADDRESS')
    }
    if(errorBundle.indexOf('INVALID_TRANSFER_AMOUNT') > -1 || errorBundle.indexOf('TRANSFER_TOO_SMALL') > -1
      || errorBundle.indexOf('TRANSFER_TOO_LARGE') > -1 ) {
      this.errors.push('INVALID_TRANSFER_AMOUNT')
    }
    if(errorBundle.indexOf('NAV_TO_NAV_TRANSFER') > -1) {
      this.errors.push('NAV_TO_NAV_TRANSFER')
    }
    if(errorBundle.indexOf('CHANGELLY_ERROR') > -1) {
      this.errors.push('CHANGELLY_ERROR')
    }
  }

  displayError(error) {
    console.log(error)
    switch(error.slice(0,3)){
      case('404'):
        this.errors.push('NOT_FOUND')
        break
      case('400'):
        this.errors.push('DATA_FORMAT')
      default:
        this.errors.push('DEFAULT')
        break
    }
    this.isDisabled = true
  }

  checkCurrData(data) {
    if(data instanceof Array && data[0] instanceof String ) {
      this.displayError('400')
      return false
    }
    return true
  }

  formatCurrData(coins) {
    const formattedCoins = []
    coins.forEach((coin) => {
      formattedCoins.push(coin.toUpperCase())
    })
    return formattedCoins
  }
}
