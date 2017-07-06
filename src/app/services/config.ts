export const changellyNodeApiEndPoints = {
  getCurrencies: 'getCurrencies',
  getMinAmount: 'getMinAmount',
  getExchangeAmount: 'getExchangeAmount',
  getGenerateAddress: 'generateAddress',
  getTransaction: 'getTransactions',
  getExchangeStatus: 'getStatus',
}

export const nodeApiBaseUrl = 'https://localhost:3000/api/'

export const changellyConstData = {
  'CHANGELLY_FEE': 0.005,
  'NAVTECH_FEE': 0.005,
  'MAX_NAV_PER_TRADE': 10000,
}

export interface dataBundleTemplate {
  transferAmount?: number,
  originCoin?: string,
  destCoin?: string,
  destAddr?: string,
  estConvToNav?: number,
  estConvFromNav?: number,
  estTime?: any,
  changellyFeeOne?: number,
  navTechFee?: number,
  changellyFeeTwo?: number,
  errors?: Array<string>
}
