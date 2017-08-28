import { Injectable } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing'


@Injectable()
export class GenericFunctionsService {

  constructor() { }

  calculateOrderEst(minutes) {
    jasmine.clock().install();

    let estimate = new Date()
    estimate.setMinutes(estimate.getMinutes() + minutes)
    return estimate
  }
}
