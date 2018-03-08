import BigNumber from 'bignumber.js'

export const changellyNodeApiEndPoints = {
  getCurrencies: 'getCurrencies',
  getMinAmount: 'getMinAmount',
  getExchangeAmount: 'getExchangeAmount',
  getGenerateAddress: 'generateAddress',
  getTransaction: 'getTransactions',
  getExchangeStatus: 'getStatus',
  getEta: 'getEta',
}

export const orderNodeApiEndPoints = {
  createOrder: 'createOrder',
  getOrder: 'getOrder',
  getOrderStatus: 'getOrderStatus',
  abandonOrder: 'abandonOrder',
  getEta: 'getEta',
}

export const nodeApiBaseUrl = 'http://localhost:8080/api/'

export const socketsUrl = 'http://localhost:8080'

export const changellyConstData = {
  CHANGELLY_FEE: 0.005,
  NAVTECH_FEE: 0.005,

  MAX_NAV_PER_TRADE: 10000,
}

export interface dataBundleTemplate {
  transferAmount?: string
  originCoin?: string
  destCoin?: string
  destAddr?: string
  estConvToNav?: any
  estConvFromNav?: string
  estTime?: any
  estimatedFees?: string
  changellyFeeOne?: any
  minTransferAmount?: string
  errors?: Array<string>
}
