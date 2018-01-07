'use strict'

const Keygen = require('generate-key')

const GetNewAddress = require('../rpc/get-new-address')
const ChangellyCtrl = require('../changelly/changelly.ctrl')
const TransactionCtrl = require('../db/transaction.ctrl')
const ServerModeCtrl = require('../db/serverMode.ctrl')
const Validator = require('../options-validator')
const ApiOptions = require('../../api-options.json')
let ErrorHandler = require('../error-handler') // eslint-disable-line prefer-const

const OrderCtrl = {}

OrderCtrl.createOrder = (req, res) => {
  Validator.startValidation(req.params, ApiOptions.orderOptions)
  .then(() => {
    OrderCtrl.checkServerMode(req, res)
  })
  .catch((error) => {
    ErrorHandler.handleError('Unable to create Polymorph Order', error, 'ORDER_CTRL_001', true, res)
  })
}

OrderCtrl.checkServerMode = (req, res) => {
  OrderCtrl.checkForMaintenance()
  .then((maintenanceActive) => {
    if (maintenanceActive) {
      res.send(JSON.stringify({
        status: 200,
        type: 'MAINTENANCE',
        data: [],
      }))
      return
    }
    OrderCtrl.beginOrderCreation(req, res)
  })
  .catch((error) => {
    ErrorHandler.handleError('Unable to create Polymorph Order', error, 'ORDER_CTRL_002', true, res)
  })
}

OrderCtrl.beginOrderCreation = (req, res) => {
  OrderCtrl.getNavAddress()
  .then((address) => {
    req.params.navAddress = address
    OrderCtrl.getFirstChangellyAddress(req, res)
  })
  .catch((error) => {
    ErrorHandler.handleError('Unable to create Polymorph Order', error, 'ORDER_CTRL_003', true, res)
  })
}

OrderCtrl.getFirstChangellyAddress = (req, res) => {
  if (req.params.from === 'NAV') {
    req.params.changellyAddressOne = req.params.navAddress
    OrderCtrl.getSecondChangellyAddress(req, res)
  } else {
    OrderCtrl.getChangellyAddress(req.params.from, 'NAV', req.params.navAddress)
    .then((address) => {
      req.params.changellyAddressOne = address
      OrderCtrl.getSecondChangellyAddress(req, res)
    })
    .catch((error) => {
      ErrorHandler.handleError('Unable to create Polymorph Order', error, 'ORDER_CTRL_004', true, res)
    })
  }
}

OrderCtrl.getSecondChangellyAddress = (req, res) => {
  if (req.params.to === 'NAV') {
    req.params.changellyAddressTwo = req.params.address
    OrderCtrl.prepForDb(req, res)
  } else {
    OrderCtrl.getChangellyAddress('NAV', req.params.to, req.params.address)
    .then((address) => {
      req.params.changellyAddressTwo = address
      OrderCtrl.prepForDb(req, res)
    })
    .catch((error) => {
      ErrorHandler.handleError('Unable to create Polymorph Order', error, 'ORDER_CTRL_005', true, res)
    })
  }
}

OrderCtrl.prepForDb = (req, res) => {
  req.params.polymorphPass = Keygen.generateKey(16)
  // req.params.changellyId = '001'

  OrderCtrl.generateOrderId()
  .then((polymorphId) => {
    req.params.polymorphId = polymorphId
    OrderCtrl.storeOrder(req, res)
  })
  .catch((error) => {
    ErrorHandler.handleError('Unable to create Polymorph Order', error, 'ORDER_CTRL_006', true, res)
  })
}

OrderCtrl.storeOrder = (req, res) => {
  TransactionCtrl.createTransaction(req, res)
  .then(() => {
    res.send(JSON.stringify({
      status: 200,
      type: 'SUCCESS',
      data: [req.params.polymorphId, req.params.polymorphPass],
    }))
  })
  .catch((error) => {
    ErrorHandler.handleError('Unable to create Polymorph Order', error, 'ORDER_CTRL_007', true, res)
  })
}

OrderCtrl.checkForMaintenance = () => {
  return new Promise((fulfill, reject) => {
    ServerModeCtrl.checkMode()
    .then((mode) => {
      if (mode === 'MAINTENANCE') {
        fulfill(true)
      } else {
        fulfill(false)
      }
    })
    .catch(err => reject(err))
  })
}


OrderCtrl.getNavAddress = () => {
  return new Promise((fulfill, reject) => {
    GetNewAddress.getNewAddress()
    .then((newAddress) => {
      fulfill(newAddress)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

OrderCtrl.getChangellyAddress = (inputCurrency, outputCurrency, destAddress) => {
  return new Promise((fulfill, reject) => {
    if (outputCurrency === 'NAV') {
      fulfill(destAddress)
    }
    ChangellyCtrl.internal.generateAddress({
      from: inputCurrency.toLowerCase(),
      to: outputCurrency.toLowerCase(),
      address: destAddress,
      extraId: null,
    })
    .then((data) => {
      fulfill(data.result.address)
    })
    .catch((error) => { reject(error) })
  })
}

OrderCtrl.generateOrderId = () => {
  return new Promise((fulfill, reject) => {
    const polymorphId = Keygen.generateKey(16)
    TransactionCtrl.checkIfIdExists(polymorphId)
    .then((existsInDb) => {
      if (existsInDb) {
        OrderCtrl.generateOrderId()
        .then((newId) => { fulfill(newId) })
        .catch((error) => { reject(error) })
      }
      fulfill(polymorphId)
    })
    .catch((error) => { reject(error) })
  })
}

module.exports = OrderCtrl
