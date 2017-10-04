const ConfigData = require('../../config')
const ApiOptions = require('../../api-options.json')
const crypto = require('crypto')
const jayson = require('jayson')
const Logger = require('../logger')

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

ChangellyCtrl.getCurrencies = (req, res) => {
  ChangellyCtrl.request(ConfigData.changellyApiEndPoints.getCurrencies, {}, (err, data) => {
    if (err) {
      Logger.writeLog('CHNGLLY_001', 'Failed to getCurrencies', err, true)
      res.send(err)
    } else {
      res.send(data)
    }
  })
}

ChangellyCtrl.getMinAmount = (req, res) => {
  ChangellyCtrl.validateParams(req.params, ApiOptions.getMinAmountOptions)
  .then(() => {
    return ChangellyCtrl.request(ConfigData.changellyApiEndPoints.getMinAmount, req.params, (err, data) => {
      if (err) {
        Logger.writeLog('CHNGLLY_002', 'Failed to getMinAmount', err, true)
        res.send(err)
      } else {
        res.send(data)
      }
    })
  })
  .catch((error) => {res.send(error)})
}

ChangellyCtrl.getExchangeAmount = (req, res) => {
  ChangellyCtrl.validateParams(req.params, ApiOptions.getExchangeAmountOptions)
  .then(() => {
    return ChangellyCtrl.request(ConfigData.changellyApiEndPoints.getExchangeAmount, req.params, (err, data) => {
      if (err) {
        Logger.writeLog('CHNGLLY_003', 'Failed to getExchangeAmount', err, true)
        res.send(err)
      } else {
        res.send(data)
      }
    })
  })
  .catch((error) => { res.send(error)})
}

ChangellyCtrl.generateAddress = (req, res) => {
  ChangellyCtrl.validateParams(req.params, ApiOptions.generateAddressOptions)
  .then(() => {
    return ChangellyCtrl.request(ConfigData.changellyApiEndPoints.generateAddress, req.params, (err, data) => {
      if (err) {
        Logger.writeLog('CHNGLLY_004', 'Failed to generateAddress (external)', err, true)
        res.send(err)
      } else {
        res.send(data)
      }
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
          Logger.writeLog('CHNGLLY_005', 'Failed to generateAddress (internal)', err, false)
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
    Validator.startValidatation(params, options)  
    .then(() => {
      fulfill()
    })
    .catch((error) => {
      Logger.writeLog('CHNGLLY_006', 'Param Validation Error', error, false)
      reject(error)
    })
  })
}

module.exports = ChangellyCtrl
