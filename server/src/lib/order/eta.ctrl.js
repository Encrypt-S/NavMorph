const config = require('../../server-settings')
let apiOptions = require('../../api-options.json') // eslint-disable-line prefer-const

let validStatuses = config.validOrderStatuses // eslint-disable-line prefer-const
let timeConsts = config.timeConsts // eslint-disable-line prefer-const
let validator = require('../options-validator') // eslint-disable-line prefer-const
let errorHandler = require('../error-handler') // eslint-disable-line prefer-const

const EtaCtrl = {}

EtaCtrl.generateEstimateRoute = async (req, res) => {
  try {
    await validator.startValidation(req.params, apiOptions.generateEstimateOptions)
    const eta = await EtaCtrl.getEta({
      status: 'ESTIMATE',
      timeSent: new Date(),
      from: req.params.from,
      to: req.params.to,
    })
    return res.status(200).json({ data: { eta: eta } })
  } catch (err) {
    errorHandler.handleError({
      statusMessage: 'Unable to get ETA',
      err: err,
      code: 'ETA_CTRL_001',
      sendEmail: true,
      res,
    })
  }
}

EtaCtrl.getEta = async params => {
  try {
    await validator.startValidation(params, apiOptions.getEtaOptions)
    if (!EtaCtrl.validStatus(params.status)) {
      throw new Error('INVALID_ORDER_STATUS')
    } else if (params.status === 'FINISHED' && !(params.timeSent instanceof Date)) {
      throw new Error('INVALID_SENT_TIME')
    }
    return await EtaCtrl.buildEta(params)
  } catch (error) {
    throw error
  }
}

EtaCtrl.validStatus = status => {
  if (validStatuses.indexOf(status) === -1) {
    return false
  }
  return true
}

EtaCtrl.buildEta = options => {
  let etaMin = 0 // These are in minutes
  let etaMax = 0

  switch (options.status) {
    case 'COMPLETED':
    case 'ABANDONED':
    case 'FAILED':
    case 'REFUNDED':
    case 'EXPIRED':
      break
    case 'CREATED':
    case 'ESTIMATE':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0] * 2
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1] * 2
      if (options.originCoin === 'NAV' || options.destCoin === 'NAV') {
        etaMin -= timeConsts.changelly[0]
        etaMax -= timeConsts.changelly[1]
      }
      break
    case 'CONFIRMING':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]
      if (options.destCoin === 'NAV') {
        etaMin -= timeConsts.changelly[0]
        etaMax -= timeConsts.changelly[1]
      }
      break
    case 'EXCHANGING':
    case 'SENDING':
      etaMin = timeConsts.navTech[0] + timeConsts.changelly[0]
      etaMax = timeConsts.navTech[1] + timeConsts.changelly[1]
      if (options.destCoin === 'NAV') {
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
      if (options.destCoin === 'NAV') {
        etaMin -= timeConsts.changelly[0]
        etaMax -= timeConsts.changelly[1]
      }
      break
  }
  return [etaMin, etaMax]
}

EtaCtrl.factorTimeSinceSending = (min, max, timeSent) => {
  const minutesPassed = Math.round((new Date() - timeSent) / 1000 / 60, 0)
  return [min - minutesPassed, max - minutesPassed]
}

module.exports = EtaCtrl
