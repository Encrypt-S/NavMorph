export const changellyNodeApiEndPoints = {
  getCurrencies: 'getCurrencies',
  getMinAmount: 'getMinAmount',
  getExchangeAmount: 'getExchangeAmount',
  getGenerateAddress: 'generateAddress',
  getTransaction: 'getTransactions',
  getExchangeStatus: 'getStatus',
}

export const nodeApiBaseUrl = 'http://localhost:3000/api/'

export const blankDataBundle = {
  'transferAmount': undefined,
  'originCoin': undefined,
  'destCoin': undefined,
  'destAddr': undefined,
  'estConvToNav': undefined,
  'estConvFromNav': undefined,
  'estTime': undefined,
  'changellyFeeTotalToNav': undefined,
  'navtechFeeTotal': undefined,
  'changellyFeeTotalFromNav': undefined,
  'minTransferAmount': undefined,
  'validData': false,
  'errors': {
    'invalidDestAddress': false,
    'invalidTransferAmount': false,
    'transferTooSmall': false,
    'transferTooLarge': false,
    'navToNavTransfer': false,
    'changellyError': false
  }
}

export const changellyConstData = {
  'CHANGELLY_FEE': 0.995,
  'NAVTECH_FEE': 0.995,
  'MAX_NAV_PER_TRADE': 10000,
}
