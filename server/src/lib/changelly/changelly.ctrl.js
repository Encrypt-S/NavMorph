const ConfigData = require('../../server-settings')
const ApiOptions = require('../../api-options.json')

const crypto = require('crypto')
const jayson = require('jayson')
const logger = require('../logger')

const URL = ConfigData.changellyUrl
const client = jayson.client.https(URL)
const Validator = require('../options-validator')

const ChangellyCtrl = { internal: {} }

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

ChangellyCtrl.request = (method, options, callback) => {
  const id = ChangellyCtrl.id()
  const message = jayson.utils.request(method, options, id)
  client.options.headers = {
    'api-key': ConfigData.changellyKey,
    sign: ChangellyCtrl.sign(message),
  }
  client.request(method, options, id, (err, response) => {
    callback(err, response)
  })
}

ChangellyCtrl.response = (res, data) => {
  res.json({success: true, data })
}

ChangellyCtrl.getCurrencies = (req, res) => {
  ChangellyCtrl.request(ConfigData.changellyApiEndPoints.getCurrencies, {}, (err, data) => {
    if (err) {
      logger.writeErrorLog('CHNGLLY_001', 'Failed to getCurrencies', { error: err, data }, true)
      res.send(err)
    } else if (data.result && data.result.indexOf('nav') === -1) {
      logger.writeErrorLog('CHNGLLY_006', 'Nav not listed in currencies', { error: err, data }, true)
      res.status(500).send(new Error('Nav not listed in currencies'))
    } else {
      ChangellyCtrl.response(res, { currencies: data.result })
    }
  })
}

ChangellyCtrl.getMinAmount = (req, res) => {
  ChangellyCtrl.validateParams(req.params, ApiOptions.getMinAmountOptions)
  .then(() => {
    return ChangellyCtrl.request(ConfigData.changellyApiEndPoints.getMinAmount, req.params, (err, data) => {
      if (err) {
        logger.writeErrorLog('CHNGLLY_002', 'Failed to getMinAmount', err, true)
        return res.send(err)
      }
      console.log(data)
      return ChangellyCtrl.response(res, { minAmount: data.result })
    })
  })
  .catch((error) => {res.send(error)})
}

ChangellyCtrl.getExchangeAmount = (req, res) => {

  ChangellyCtrl.validateParams(req.params, ApiOptions.getExchangeAmountOptions)
  .then(() => {
    return ChangellyCtrl.request(ConfigData.changellyApiEndPoints.getExchangeAmount, req.params, (err, data) => {
      if (err) {
        logger.writeErrorLog('CHNGLLY_003', 'Failed to getExchangeAmount', err, true)
        return res.send(err)
      }
      return ChangellyCtrl.response(res, { amount: data.result })
    })
  })
  .catch((error) => { res.send(error)})
}

ChangellyCtrl.generateAddress = (req, res) => {
  ChangellyCtrl.validateParams(req.params, ApiOptions.generateAddressOptions)
  .then(() => {
    return ChangellyCtrl.request(ConfigData.changellyApiEndPoints.generateAddress, req.params, (err, data) => {
      if (err) {
        logger.writeErrorLog('CHNGLLY_004', 'Failed to generateAddress (external)', err, true)
        return res.send(err)
      }

      return ChangellyCtrl.response(res, data)
    })
  })
  .catch((error) => { res.send(error)})
}

ChangellyCtrl.internal.generateAddress = (params) => {
  return new Promise((fulfill, reject) => {
    ChangellyCtrl.validateParams(params, ApiOptions.generateAddressOptions)
    .then(() => {
      ChangellyCtrl.request(ConfigData.changellyApiEndPoints.generateAddress, params, (err, data) => {
        if (data.err) {
          logger.writeErrorLog('CHNGLLY_005', 'Failed to generateAddress (internal)', err, false)
          reject(new Error(data.err))
          return
        }
        fulfill(data)
      })
    })
    .catch((error) => { reject(error)})
  })
}

ChangellyCtrl.validateParams = (params, options) => {
  return new Promise((fulfill, reject) => {
    Validator.startValidation(params, options)
    .then(() => {
      fulfill()
    })
    .catch((error) => {
      logger.writeErrorLog('CHNGLLY_006', 'Param Validation Error', error, false)
      reject(error)
    })
  })
}

module.exports = ChangellyCtrl
