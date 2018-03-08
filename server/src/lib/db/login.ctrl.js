'use strict'

const lodash = require('lodash')
let Logger = require('../logger') // eslint-disable-line prefer-const

// Compile models from schema
let BlackListModel = require('./blackList.model') // eslint-disable-line prefer-const
let FailedLoginsModel = require('./failedLogins.model') // eslint-disable-line prefer-const

const LoginCtrl = {
  runtime: {},
}

LoginCtrl.insertAttempt = options => {
  const required = ['ipAddress', 'polymorphId', 'params']
  return new Promise((fulfill, reject) => {
    if (lodash.intersection(Object.keys(options), required).length !== required.length) {
      Logger.writeErrorLog('LGN_001', 'Invalid Options', { options, required })
      reject('LGN_001')
      return
    }
    LoginCtrl.runtime = {}
    LoginCtrl.runtime.transaction = new FailedLoginsModel({
      ip_address: options.ipAddress,
      polymorph_id: options.polymorphId,
      timestamp: new Date(),
      params: JSON.stringify(options.params),
    })
    LoginCtrl.executeSave(fulfill, reject)
  })
}

LoginCtrl.blackListIp = options => {
  const required = ['ipAddress']
  return new Promise((fulfill, reject) => {
    if (lodash.intersection(Object.keys(options), required).length !== required.length) {
      Logger.writeErrorLog('LGN_004', 'Invalid Options', { options, required })
      reject('LGN_004')
      return
    }
    LoginCtrl.runtime = {}
    LoginCtrl.runtime.transaction = new BlackListModel({
      ip_address: options.ipAddress,
      timestamp: new Date(),
    })
    LoginCtrl.executeSave(fulfill, reject)
  })
}

LoginCtrl.executeSave = (fulfill, reject) => {
  try {
    LoginCtrl.runtime.transaction
      .save()
      .then(result => {
        fulfill(result)
      })
      .catch(result => {
        Logger.writeErrorLog('LGN_002', 'Save Rejected', { result })
        reject(result)
      })
  } catch (error) {
    Logger.writeErrorLog('LGN_003', 'Save Exception', { error })
    reject(error)
  }
}

LoginCtrl.checkIpBlocked = options => {
  const required = ['ipAddress']
  return new Promise((fulfill, reject) => {
    if (lodash.intersection(Object.keys(options), required).length !== required.length) {
      Logger.writeErrorLog('LGN_005', 'Invalid Options', { options, required })
      reject('LGN_005')
      return
    }
    const query = BlackListModel
    query
      .find()
      .and([{ ip_address: options.ipAddress }, { timestamp: { $gte: new Date(new Date().getTime() - 10 * 60000) } }])
      .select('ip_address timestamp')
      .exec()
      .then(result => {
        const minLength = 0
        LoginCtrl.checkResults(result, minLength, fulfill)
      })
      .catch(error => {
        reject(error)
      })
  })
}

LoginCtrl.checkIfSuspicious = ipAddress => {
  return new Promise((fulfill, reject) => {
    const query = FailedLoginsModel
    query
      .find()
      .and([{ ip_address: ipAddress }, { timestamp: { $gte: new Date(new Date().getTime() - 10 * 60000) } }])
      .select('ip_address timestamp')
      .exec()
      .then(result => {
        const minLength = 10
        LoginCtrl.checkResults(result, minLength, fulfill)
      })
      .catch(error => {
        reject(error)
      })
  })
}

LoginCtrl.checkResults = (result, minLength, fulfill) => {
  if (result.length > minLength) {
    fulfill(true)
    return
  }
  fulfill(false)
}

module.exports = LoginCtrl
