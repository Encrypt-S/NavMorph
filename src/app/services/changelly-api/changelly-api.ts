import { Injectable } from '@angular/core';

import {GenericNodeApiService}  from '../generic-node-api/generic-node-api';

@Injectable()
export class ChangellyApiService {

  constructor( private genServ:GenericNodeApiService) { }

  getCurrencies() {
    return this.getApiRequest( 'currencies', '')
  }

  getApiRequest(endpoint, params){
    if(params){ //if we have an empty string this wont affect the request
      params = '/' + params
    }
    return this.genServ.getRequest('changelly/' + endpoint + params)
  }
}
