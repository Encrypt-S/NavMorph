const ConfigData = require('../../server-settings')
const ApiOptions = require('../../api-options.json')

const crypto = require('crypto')
const jayson = require('jayson/promise')
const logger = require('../logger')

const URL = ConfigData.changellyUrl
const client = jayson.client.https(URL)
const Validator = require('../options-validator')

const ChangellyCtrl = {}

ChangellyCtrl.id = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8) // eslint-disable-line
    return v.toString(16)
  })
}

ChangellyCtrl.sign = (message) => {
  return crypto
    .createHmac('sha512', ConfigData.changellySecretKey)
    .update(JSON.stringify(message))
    .digest('hex')
}

ChangellyCtrl.request = async (method, options) => {
  const id = ChangellyCtrl.id()
  const message = jayson.utils.request(method, options, id)
  client.options.headers = {  'api-key': ConfigData.changellyKey, sign: ChangellyCtrl.sign(message) }
  const response = await client.request(method, options, id)
  if (response.error) {
    throw new Error(response.error.message || JSON.stringify(response.error))
  }
  return response
}

ChangellyCtrl.getCurrenciesRoute = async (req, res) => {
  try {
    const data = await ChangellyCtrl.request(ConfigData.changellyApiEndPoints.getCurrencies, {})

    if (data.result && data.result.indexOf('nav') === -1) {
      logger.writeErrorLog('CHNGLLY_006', 'nav not listed in currencies', { error: err, data }, true)
      return res.status(500).json({error: new Error('nav not listed in currencies')})
    }

    return res.json({data: { currencies: data.result } })
  } catch (err) {
    logger.writeErrorLog('CHNGLLY_005', 'Failed to getMinAmount', err, true)
    return res.status(500).send(new Error('Failed to get min transfer amount from Changelly'))
  }
}

ChangellyCtrl.getMinAmountRoute = async (req, res) => {
  try {

    await ChangellyCtrl.validateParams(req.params, ApiOptions.getMinAmountOptions)
    const data = await ChangellyCtrl.request(ConfigData.changellyApiEndPoints.getMinAmount, req.params)
    return res.json({data: { minAmount: data.result } })

  } catch (err) {
    logger.writeErrorLog('CHNGLLY_002', 'Failed to getMinAmount', err, true)
    return res.status(500).json({error: new Error('Failed to get min transfer amount from Changelly')})
  }
}

ChangellyCtrl.getExchangeAmountRoute = async (req, res) => {
  try {

    await ChangellyCtrl.validateParams(req.params, ApiOptions.getExchangeAmountOptions)
    const data = await ChangellyCtrl.request(ConfigData.changellyApiEndPoints.getExchangeAmount, req.params)
    return res.json({data: { amount: data.result } })

  } catch (err) {
    logger.writeErrorLog('CHNGLLY_003', 'Failed to getExchangeAmount', err, true)
    res.status(500).json({error: new Error('Failed to get the estimated exchange amount from Changelly')})
  }
}

ChangellyCtrl.generateAddress = async (params) => {
  try {
    await ChangellyCtrl.validateParams(params, ApiOptions.generateAddressOptions)
    const data = await ChangellyCtrl.request(ConfigData.changellyApiEndPoints.generateAddress, params)
    return data
  }
  catch (err) {
    logger.writeErrorLog('CHNGLLY_004', 'Failed to generateAddress', data.error, false)
    throw new Error('CHNGLLY_004 - Failed to generateAddress')
  }
}

ChangellyCtrl.validateParams = (params, options) => {
  return new Promise((fulfill, reject) => {
    Validator.startValidation(params, options)
    .then(() => {
      fulfill()
    })
    .catch((error) => {
      logger.writeErrorLog('CHNGLLY_005', 'Param Validation Error', error, false)
      reject(error)
    })
  })
}

module.exports = ChangellyCtrl
