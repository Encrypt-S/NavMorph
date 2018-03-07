import { Injectable } from '@angular/core'

import { changellyNodeApiEndPoints } from '../config'

import {GenericNodeApiService} from '../generic-node-api/generic-node-api'

@Injectable()
export class ChangellyApiService {

  constructor( private genServ:GenericNodeApiService) { }

  getCurrencies() {
    return this.getApiRequest(changellyNodeApiEndPoints.getCurrencies, undefined)
  }

  getEta(originCoin, destCoin) {
    return this.getApiRequest(changellyNodeApiEndPoints.getEta, [originCoin, destCoin])
  }

  getMinAmount(originCoin, destCoin) {
    return this.getApiRequest(changellyNodeApiEndPoints.getMinAmount, [originCoin, destCoin])
  }

  getExchangeAmount(originCoin, destCoin, amount) {
    return this.getApiRequest(changellyNodeApiEndPoints.getExchangeAmount, [originCoin, destCoin, amount])
  }

  getApiRequest(endpoint, params){
    let paramString = '/'
    if(params){ //if we have undefined this wont affect the request
      params.forEach((param, i) => {
          if( i > 0) {
            paramString += '/' + param
          } else {
            paramString += param
          }
      });
    }
    return this.genServ.getRequest('changelly/' + endpoint + paramString)
  }
}
