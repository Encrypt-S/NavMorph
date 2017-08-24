const config = require('../../config')

const validStatuses = config.validOrderStatuses
const timeConsts = config.timeConsts

const Logger = require('../logger')

const EtaCtrl = {}

EtaCtrl.getEta = (status, timeSent) => {
  return new Promise((fufill, reject) => {
    if(!EtaCtrl.validStatus(status) && status !== 'estimate') {
      reject(new Error('Invalid order status'))
      return
    } else if (status === 'sent' && !(timeSent instanceof Date)) {
      reject(new Error('Invalid sending time'))
      return
    }
    fufill(EtaCtrl.buildEta(status, timeSent))   
  })
}

EtaCtrl.validStatus = (status) => {
  if (validStatuses.indexOf(status) === -1) {
    return false
  } 
  return true
}

EtaCtrl.buildEta = (status, timeSent) => {
  let etaMin = 0 // These are in minutes
  let etaMax = 0

  switch(status) {
    case 'completed': 
    case 'abandoned':
      break
    case 'created':
    case 'estimate':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]*2
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]*2
      break
    case 'recevied':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]
      break
    case 'sent':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]
      const modifiedMinMax = EtaCtrl.factorTimeSinceSending(min, max, timeSent)
      etaMin = modifiedMinMax[0] 
      etaMax = modifiedMinMax[1] 
      break
  }

  return [etaMin, etaMax]
}

EtaCtrl.factorTimeSinceSending = (min, Max, timeSent) => {
  const minutesPassed = Math.round((new Date() - timeSent) / 1000 / 60, 0)
  return [min - minutesPassed, max - minutesPassed]
}

module.exports = EtaCtrl
