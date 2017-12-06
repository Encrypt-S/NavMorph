"use strict";

const config = require('../../config')

const validStatuses = config.validOrderStatuses
const timeConsts = config.timeConsts

const Logger = require('../logger')

const EtaCtrl = {}


EtaCtrl.generateEstimate = (req, res) => {
  EtaCtrl.getEta('ESTIMATE', undefined, req.params.from, req.params.to)
    .then((eta) => {
      res.send(eta)
    })
    .catch((error) => {
      EtaCtrl.handleError(error, res, '001')
    })
}


EtaCtrl.getEta = (status, timeSent, originCoin, destCoin) => {
  return new Promise((fufill, reject) => {
    if(!EtaCtrl.validStatus(status)) {
      reject(new Error('Invalid order status'))
      return
    } else if (status === 'FINISHED' && !(timeSent instanceof Date)) {
      reject(new Error('Invalid sending time'))
      return
    }
    fufill(EtaCtrl.buildEta(status, timeSent, originCoin, destCoin))
  })
}

EtaCtrl.validStatus = (status) => {
  if (validStatuses.indexOf(status) === -1) {
    return false
  }
  return true
}

EtaCtrl.buildEta = (status, timeSent, originCoin, destCoin) => {
  let etaMin = 0 // These are in minutes
  let etaMax = 0

  switch(status) {
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
      if (originCoin === 'nav' || destCoin === 'nav') {
        etaMin -= timeConsts.changelly[0]
        etaMax -= timeConsts.changelly[1]
      }
      break
    case 'CONFIRMING':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]
      if (destCoin === 'nav') {
        etaMin -= timeConsts.changelly[0]
        etaMax -= timeConsts.changelly[1]
      }
      break
    case 'EXCHANGING':
    case 'SENDING':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]
      if (destCoin === 'nav') {
        etaMin -= timeConsts.changelly[0]
        etaMax -= timeConsts.changelly[1]
      }
      break
    case 'FINISHED':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]
      const modifiedMinMax = EtaCtrl.factorTimeSinceSending(min, max, timeSent)
      etaMin = modifiedMinMax[0]
      etaMax = modifiedMinMax[1]
      if (destCoin === 'nav') {
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
