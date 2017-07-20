const lodash = require('lodash')
const Logger = require('../logger')

// Compile models from schema
const BlackListModel = require('./blackList.model')
const FailedLoginsModel = require('./failedLogins.model')

const LoginCtrl = {}


LoginCtrl.insertAttempt = (ipAddress, polymorphId, params) => {
  return new Promise((fulfill, reject) => {
    LoginCtrl.runtime = { }

    LoginCtrl.runtime.transaction = new FailedLoginsModel({
      ip_address: ipAddress
      polymorph_id: polymorphId,
      timestamp: new Date(),
      params: JSON.stringify(params),
    })
    try {
      LoginCtrl.runtime.transaction.save()
      .then(fulfill())
      .catch((result) => {
        if (result instanceof Error) {
          reject(result)
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

    LoginCtrl.runtime.transaction = new BlackListModel({
      ip_address: ipAddress
      timestamp: new Date(),
    })

    try {
      LoginCtrl.runtime.transaction.save()
      .then(fulfill())
      .catch((result) => {
        if (result instanceof Error) {
          reject(result)
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
    
    query.find([{ ip_address: ipAddress }])
    .select('ip_address timestamp')
    .exec()
    .then((result) => { 
      if ( 0 === Object.keys(result).length || 
        result.timestamp < new Date(new Date().getTime() - 10 * 60000)) {

        fulfill(false) 
        return
      }
      fulfill(true) 
    })
    .catch((error) => { reject(error) })
  })
}

LoginCtrl.checkIfSuspicious = (ipAddress) => {
  return new Promise((fulfill, reject) => {
    const query = BlackListModel.find()
    
    query.find([{ ip_address: ipAddress }])
    .select('ip_address timestamp')
    .exec()
    .then((result) => { 
      if ( 0 === Object.keys(result).length || 
        result.timestamp < new Date(new Date().getTime() - 10 * 60000)) {

        fulfill(false) 
        return
      }
      fulfill(true) 
    })
    .catch((error) => { reject(error) })
  })
}

module.exports = LoginCtrl
