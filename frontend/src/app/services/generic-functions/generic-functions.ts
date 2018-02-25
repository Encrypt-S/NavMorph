import { Injectable } from '@angular/core';

@Injectable()
export class GenericFunctionsService {

  constructor() { }

  calculateOrderEst(minutes) {
    let estimate = new Date()
    estimate.setMinutes(estimate.getMinutes() + minutes)
    return estimate
  }
}
