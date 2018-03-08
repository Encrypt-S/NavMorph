'use strict'

const lodash = require('lodash')

// Compile model from schema
let ServerModeModel = require('./serverMode.model')
let ServerMessageModel = require('./serverMessage.model')

const ServerModeCtrl = {}

ServerModeCtrl.checkMode = () => {
  return new Promise((fulfill, reject) => {
    ServerModeModel.find({})
      .select('server_mode')
      .exec()
      .then(modeStatus => {
        fulfill(modeStatus)
      })
      .catch(error => {
        reject(error)
      })
  })
}

ServerModeCtrl.checkMessage = () => {
  return new Promise((fulfill, reject) => {
    ServerMessageModel.find({})
      .exec()
      .then(serverMessage => {
        fulfill(serverMessage)
      })
      .catch(error => {
        reject(error)
      })
  })
}

module.exports = ServerModeCtrl
