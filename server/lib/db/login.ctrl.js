const lodash = require('lodash')
const Logger = require('../logger')

// Compile models from schema
const BlackListModel = require('./blackList.model')
let FailedLoginsModel = require('./failedLogins.model')

const LoginCtrl = {}


LoginCtrl.insertAttempt = (options) => {
  const required = ['ipAddress', 'polymorphId', 'params']
  return new Promise((fulfill, reject) => {
    if (lodash.intersection(Object.keys(options), required).length !== required.length) {
      Logger.writeLog('LGN_001', 'invalid options', { options, required })
      reject('LGN_001')
      return
    }
    LoginCtrl.runtime = {}
    LoginCtrl.runtime.transaction = new FailedLoginsModel(
    {
      ip_address: options.ipAddress,
      polymorph_id: options.polymorphId,
      timestamp: new Date(),
      params: JSON.stringify(options.params),
    })
    try {

      LoginCtrl.runtime.transaction.save()
      .then(fulfill('SUCCESS'))
      .catch((result) => {
        if (result instanceof Error) {
          console.log('result', result)
          reject(result)
          return
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

LoginCtrl.blackListIp = (ipAddress) => {
  return new Promise((fulfill, reject) => {
    LoginCtrl.runtime = { }
    LoginCtrl.runtime.transaction = new BlackListModel(
    {
      ip_address: ipAddress,
      timestamp: new Date(),
    })
    try {
      LoginCtrl.runtime.transaction.save()
      .then(() => {
        fulfill()
        return
      })
      .catch((result) => {
        if (result instanceof Error) {
          reject(result)
          return
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}


LoginCtrl.checkIpBlocked = (ipAddress) => {
  return new Promise((fulfill, reject) => {
    const query = BlackListModel.find()

    query.and([
      { ip_address: ipAddress },
      {timestamp: {
      '$gte': new Date(new Date().getTime() - 10 * 60000),
      }}
    ])
    .select('ip_address timestamp')
    .exec()
    .then((result) => {
      if (result.length > 0) {
        fulfill(true)
        return
      }
      fulfill(false)
    })
    .catch((error) => { reject(error) })
  })
}

LoginCtrl.checkIfSuspicious = (ipAddress) => {
  return new Promise((fulfill, reject) => {
    const query = FailedLoginsModel.find()
    query.and([
      { ip_address: ipAddress },
      {timestamp: {
      '$gte': new Date(new Date().getTime() - 10 * 60000),
      }}
    ])
    .select('ip_address timestamp')
    .exec()
    .then((result) => {
      if (result.length >= 10) {
        fulfill(true)
        return
      }
      fulfill(false)
    })
    .catch((error) => { reject(error) })
  })
}

module.exports = LoginCtrl
