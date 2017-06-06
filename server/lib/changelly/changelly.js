const configData = require('../../config')
const crypto = require('crypto')
const jayson = require('jayson')

const URL = configData.changellyUrl
const client = jayson.client.https(URL)

const Changelly = {}

Changelly.id = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

Changelly.sign = (message) => {
  return crypto
    .createHmac('sha512', configData.changellySecretKey)
    .update(JSON.stringify(message))
    .digest('hex')
}

Changelly.request = (method, options, callback) => {
  const id = Changelly.id()
  const message = jayson.utils.request(method, options, id)
  client.options.headers = {
    'api-key': configData.changellyKey,
    'sign': Changelly.sign(message)
  }
  client.request(method, options, id, (err, response) => {
    callback(err, response)
  })
}

Changelly.getCurrencies = (res) => {
  Changelly.request(configData.changellyApiEndPoints.getCurrencies, {}, (err, data) => {
    if (err) {
      console.log('Error: ', err)
    } else {
      res.send(data)
    }
  })
}

module.exports = Changelly
