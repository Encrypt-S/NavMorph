const configData = require('../../config')
const crypto = require('crypto')
const jayson = require('jayson')

const URL = configData.changellyUrl
const client = jayson.client.https(URL)

const ChangellyCtrl = {}

ChangellyCtrl.id = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8) // eslint-disable-line
    return v.toString(16)
  })
}

ChangellyCtrl.sign = (message) => {
  return crypto
    .createHmac('sha512', configData.changellySecretKey)
    .update(JSON.stringify(message))
    .digest('hex')
}

ChangellyCtrl.request = (method, options, callback) => {
  const id = ChangellyCtrl.id()
  const message = jayson.utils.request(method, options, id)
  client.options.headers = {
    'api-key': configData.changellyKey,
    sign: ChangellyCtrl.sign(message),
  }
  client.request(method, options, id, (err, response) => {
    callback(err, response)
  })
}

ChangellyCtrl.getCurrencies = (req, res) => {
  ChangellyCtrl.request(configData.changellyApiEndPoints.getCurrencies, {}, (err, data) => {
    if (err) {
      console.log('Error: ', err)
      res.send(err)
    } else {
      res.send(data)
    }
  })
}

ChangellyCtrl.getMinAmount = (req, res) => {
  return ChangellyCtrl.request('getMinAmount', req.params, (err, data) => {
    if (err) {
      console.log('Error: ', err)
      res.send(err)
    } else {
      res.send(data)
    }
  })
}

ChangellyCtrl.getExchangeAmount = (req, res) => {
  return ChangellyCtrl.request('getExchangeAmount', req.params, (err, data) => {
    if (err) {
      console.log('Error: ', err)
    } else {
      res.send(data)
    }
  })
}

ChangellyCtrl.generateAddress = (req, res) => {
  return ChangellyCtrl.request('generateAddress', req.params, (err, data) => {
    if (err) {
      console.log('Error: ', err)
      res.send(err)
    } else {
      res.send(data)
    }
  })
}

module.exports = ChangellyCtrl
