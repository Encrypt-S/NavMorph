import { Injectable } from '@angular/core';

import {GenericNodeApiService}  from '../generic-node-api/generic-node-api';

import { orderNodeApiEndPoints } from "../config";

@Injectable()
export class OrderService {

  constructor( private genServ:GenericNodeApiService) { }

  createOrder(originCoin, destCoin, destAddr, transferAmount) {
    return this.getApiRequest( orderNodeApiEndPoints.createOrder, [originCoin, destCoin, destAddr, transferAmount])
  }

  getOrder(orderId) {
    return this.getApiRequest( orderNodeApiEndPoints.getOrder, [orderId])
  }

  updateOrderStatus(orderId, newStatus) {
    return this.getApiRequest( orderNodeApiEndPoints.getOrderStatus, [orderId, newStatus])
  }

  abandonOrder(orderId) {
    return this.getApiRequest( orderNodeApiEndPoints.abandonOrder, [orderId])
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
    return this.genServ.getRequest('order/' + endpoint + paramString)
  }
}
