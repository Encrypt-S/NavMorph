"use strict";

const Config = require('../../config')
const ApiOptions = require('../../api-options.json')

const validStatuses = Config.validOrderStatuses
const timeConsts = Config.timeConsts
const Validator = require('../options-validator')
const Logger = require('../logger')

const EtaCtrl = {}


EtaCtrl.generateEstimate = (req, res) => {
  Validator.startValidatation(req.params, ApiOptions.generateEstimateOptions)
  .then(() => {
    return EtaCtrl.getEta({ status: 'ESTIMATE', timeSent: new Date(), from: req.params.from, to: req.params.to })  
  })
  .then((eta) => {
    res.send(eta)
  })
  .catch((error) => {
    EtaCtrl.handleError(error, res, '001')    
  })
}

EtaCtrl.getEta = (params) => {
  return new Promise((fufill, reject) => {
    Validator.startValidatation(params, ApiOptions.getEtaOptions)
    .then(() => {
      if(!EtaCtrl.validStatus(params.status)) {
        reject(new Error('Invalid order status'))
        return
      } else if (params.status === 'FINISHED' && !(params.timeSent instanceof Date)) {
        reject(new Error('Invalid sending time'))
        return
      }
      fufill(EtaCtrl.buildEta(params))   
    })
    .catch((error) => { reject(error) })
  })

}

EtaCtrl.validStatus = (status) => {
  if (validStatuses.indexOf(status) === -1) {
    return false
  }
  return true
}

EtaCtrl.buildEta = (options) => {
  let etaMin = 0 // These are in minutes
  let etaMax = 0

  switch(options.status) {
    case 'COMPLETED': 
    case 'ABANDONED':
    case 'FAILED':
    case 'REFUNDED':
    case 'EXPIRED':
      break
    case 'CREATED':
    case 'ESTIMATE':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]*2
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]*2
      if (options.originCoin === 'nav' || options.destCoin === 'nav') {
        etaMin -= timeConsts.changelly[0]
        etaMax -= timeConsts.changelly[1]
      }
      break
    case 'CONFIRMING':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]
      if (options.destCoin === 'nav') {
        etaMin -= timeConsts.changelly[0]
        etaMax -= timeConsts.changelly[1]
      }
      break
    case 'EXCHANGING':
    case 'SENDING':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]
      if (options.destCoin === 'nav') {
        etaMin -= timeConsts.changelly[0]
        etaMax -= timeConsts.changelly[1]
      }
      break
    case 'FINISHED':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]
      const modifiedMinMax = EtaCtrl.factorTimeSinceSending(etaMin, etaMax, options.timeSent)
      etaMin = modifiedMinMax[0] 
      etaMax = modifiedMinMax[1]
      if (options.destCoin === 'nav') {
        etaMin -= timeConsts.changelly[0]
        etaMax -= timeConsts.changelly[1]
      }
      break
  }
  return [etaMin, etaMax]
}

EtaCtrl.factorTimeSinceSending = (min, Max, timeSent) => {
  const minutesPassed = Math.round((new Date() - timeSent) / 1000 / 60, 0)
  return [min - minutesPassed, max - minutesPassed]
}

EtaCtrl.handleError = (err, res, code) => {
  const statusMessage = 'Unable to get ETA'
  res.send(JSON.stringify({
    statusCode: 200,
    type: 'FAIL',
    statusMessage,
  }))
  Logger.writeLog(code, statusMessage, { error: err }, true)
}

module.exports = EtaCtrl
