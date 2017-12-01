"use strict";

const lodash = require('lodash')
const Logger = require('../logger')

// Compile model from schema
const ServerModeModel = require('./serverMode.model')
const ServerMessageModel = require('./serverMessage.model')

const ServerModeCtrl = {}

ServerModeCtrl.checkMode = () => {
  return new Promise((fulfill, reject) => {
    ServerModeModel.find({})
    .select('server_mode')
    .exec()
    .then((mode_status) => { fulfill(mode_status) })
    .catch((error) => { reject(error) })
  })
}

ServerModeCtrl.checkMessage = () => {
  return new Promise((fulfill, reject) => {
    ServerMessageModel.find({})
    .exec()
    .then((server_message) => { fulfill(server_message) })
    .catch((error) => { reject(error) })
  })
}

module.exports = ServerModeCtrl
