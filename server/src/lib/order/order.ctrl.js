'use strict'

const Keygen = require('generate-key')

const client = require('../rpc/client')
const ChangellyCtrl = require('../changelly/changelly.ctrl')
const TransactionCtrl = require('../db/transaction.ctrl')
const ServerModeCtrl = require('../db/serverMode.ctrl')
const Validator = require('../options-validator')
const ApiOptions = require('../../api-options.json')
let ErrorHandler = require('../error-handler') // eslint-disable-line prefer-const

const OrderCtrl = {}

OrderCtrl.createOrder = async (req, res) => {
  console.log('create Order - req.params', req.params, ApiOptions.orderOptions)
  try {
    await Validator.startValidation(req.params, ApiOptions.orderOptions)
    await OrderCtrl.checkForMaintenance(req, res)
    await OrderCtrl.beginOrderCreation(req, res)
    console.log('Finished...')
  } catch (error) {
    console.log('OrderCtrl.createOrder', error)
    ErrorHandler.handleError({
      statusMessage: 'Unable to create Polymorph Order',
      err: error,
      code: 'ORDER_CTRL_001',
      sendEmail: true,
      res
    })
  }
}

// OrderCtrl.checkServerMode = (req, res) => {
//   OrderCtrl.checkForMaintenance()
//   .then((maintenanceActive) => {
//     if (maintenanceActive) {
//       res.send(JSON.stringify({
//         status: 200,
//         type: 'MAINTENANCE',
//         data: [],
//       }))
//     }
//   })
//   .catch((error) => {
//     ErrorHandler.handleError({
//       statusMessage: 'Unable to create Polymorph Order',
//       err: error,
//       code: 'ORDER_CTRL_002',
//       sendEmail: true,
//       res
//     })
//   })
// }

OrderCtrl.beginOrderCreation = (req, res) => {
  OrderCtrl.getNavAddress()
  .then((address) => {
    req.params.navAddress = address
    OrderCtrl.getFirstChangellyAddress(req, res)
  })
  .catch((error) => {
    ErrorHandler.handleError({
      statusMessage: 'Unable to create Polymorph Order',
      err: error,
      code: 'ORDER_CTRL_003',
      sendEmail: true,
      res
    })
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
      ErrorHandler.handleError({
        statusMessage: 'Unable to create Polymorph Order',
        err: error,
        code: 'ORDER_CTRL_004',
        sendEmail: true,
        res
      })
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
      ErrorHandler.handleError({
        statusMessage: 'Unable to create Polymorph Order',
        err: error,
        code: 'ORDER_CTRL_005',
        sendEmail: true,
        res
      })
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
    ErrorHandler.handleError({
      statusMessage: 'Unable to create Polymorph Order',
      err: error,
      code: 'ORDER_CTRL_006',
      sendEmail: true,
      res
    })
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
    ErrorHandler.handleError({
      statusMessage: 'Unable to create Polymorph Order',
      err: error,
      code: 'ORDER_CTRL_007',
      sendEmail: true,
      res
    })
  })
}

OrderCtrl.checkForMaintenance = async () => {
  const mode = await ServerModeCtrl.checkMode()
  return mode
}


OrderCtrl.getNavAddress = async () => {
  const address = client.nav.getNewAddress()
  return address
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
