"use strict";

const Rpc = require('./client')
let Logger = require('../logger')

Rpc.getInfo = () => {
  return new Promise((fulfill, reject) => {
    Rpc.navClient.getInfo()
    .then(address => fulfill(address))
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = Rpc
