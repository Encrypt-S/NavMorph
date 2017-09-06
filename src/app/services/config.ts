import * as BigNumber from 'bignumber.js'

export const changellyNodeApiEndPoints = {
  getCurrencies: 'getCurrencies',
  getMinAmount: 'getMinAmount',
  getExchangeAmount: 'getExchangeAmount',
  getGenerateAddress: 'generateAddress',
  getTransaction: 'getTransactions',
  getExchangeStatus: 'getStatus',
}

export const orderNodeApiEndPoints = {
  createOrder: 'createOrder',
  getOrder: 'getOrder',
  getOrderStatus: 'getOrderStatus',
  abandonOrder: 'abandonOrder',
}

export const nodeApiBaseUrl = 'https://localhost:3000/api/'

export const changellyConstData = {
  'CHANGELLY_FEE': 0.005,
  'NAVTECH_FEE': 0.005,

  'MAX_NAV_PER_TRADE': 10000,
}

export interface dataBundleTemplate {
  transferAmount?: BigNumber,
  originCoin?: string,
  destCoin?: string,
  destAddr?: string,
  estConvToNav?: BigNumber,
  estConvFromNav?: BigNumber,
  estTime?: any,
  estimatedFees?: BigNumber,
  changellyFeeOne?: BigNumber,
  errors?: Array<string>
}
