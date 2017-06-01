const URL = 'https://api.changelly.com';

const testData =
  {
    'data': [
      { 'name': 'Nav Coin', 'ticker': 'NAV' },
      { 'name': 'Bitcoin', 'ticker': 'BTC' },
      { 'name': 'Ethereum', 'ticker': 'ETH' },
      { 'name': 'Dogecoin', 'ticker': 'DOGE' }
    ]
  }


const Changelly = {}

Changelly.getCurrencies = function (callback) {
  return testData
  // return request('getCurrencies', {}, callback);
}

module.exports = Changelly
