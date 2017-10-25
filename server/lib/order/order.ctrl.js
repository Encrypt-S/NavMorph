const Keygen = require('generate-key')

const GetNewAddress = require('../rpc/get-new-address')
const ChangellyCtrl = require('../changelly/changelly.ctrl')
const TransactionCtrl = require('../db/transaction.ctrl')
const ServerModeCtrl = require('../db/serverMode.ctrl')
const Logger = require('../logger')
const Validator = require('../options-validator')
const ApiOptions = require('../../api-options.json')


const OrderCtrl = {}

OrderCtrl.createOrder = (req, res) => {
  Validator.startValidatation(req.params, ApiOptions.orderOptions)
  .then(() => {
    OrderCtrl.checkServerMode(req, res)
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res, '002')
  })
}

OrderCtrl.checkServerMode = (req, res) => {
  OrderCtrl.checkForMaintenance()
  .then((maintenanceActive) => {
    if(maintenanceActive) {
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
    OrderCtrl.handleError(error, res, '002')
  })}

OrderCtrl.beginOrderCreation = (req, res) => {
  OrderCtrl.getNavAddress()
  .then((address) => {
    req.params.navAddress = address
    OrderCtrl.getFirstChangellyAddress(req, res)
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res, '003')
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
      OrderCtrl.handleError(error, res, '004')
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
      OrderCtrl.handleError(error, res, '005')
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
    OrderCtrl.handleError(error, res, '006')
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
    OrderCtrl.handleError(error, res, '007')
  })
}

OrderCtrl.checkForMaintenance = () => {
  return new Promise((fulfill, reject) => {
    serverModeCtrl.checkMode()
    .then((mode) => {
      if(mode === 'MAINTENANCE'){
        fulfill(true)
      } else {
        fulfill(false)
      }
    })
    .catch((err) => reject(err))
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
    if(outputCurrency === 'NAV'){
      fulfill(destAddress)
    }
    ChangellyCtrl.internal.generateAddress({
      from: inputCurrency.toLowerCase(),
      to: outputCurrency.toLowerCase(),
      address: destAddress,
      extraId: null,
    })
    .then((data) => {
      if (data instanceof Error) {
        reject(data)
      }
      fulfill(data.result.address)
    })
  })
}

OrderCtrl.generateOrderId = () => {
  return new Promise((fulfill, reject) => {
    const polymorphId = Keygen.generateKey(16)
    TransactionCtrl.internalCheckIfIdExists(polymorphId)
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

OrderCtrl.handleError = (err, res, code) => {
  const statusMessage = 'Unable to create Polymorph Order'
  res.send(JSON.stringify({
    statusCode: 200,
    type: 'FAIL',
    code: 'ORDER_CTRL_' + code || '001',
    statusMessage,
    err,
  }))
  Logger.writeLog(code, statusMessage, { error: err }, true)
}
module.exports = OrderCtrl
