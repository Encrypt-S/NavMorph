import { Observable } from 'rxjs';

export const fakeData  = ['NAV', 'BTC', 'ETH', 'LTC']
const fiveCoins = 5

export class MockChangellyService {
  getCurrencies = function(){
      return Observable.of(fakeData)
    }

  getExchangeAmount = function(){
      return Observable.of(fiveCoins)
    }
    getMinAmount = function(){
      return Observable.of(fiveCoins)
    }
  }
