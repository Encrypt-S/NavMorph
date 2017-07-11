const Keygen = require('generate-key')

const GetNewAddress = require('../rpc/get-new-address')
const ChangellyCtrl = require('../changelly/changelly.ctrl')
const TransactionCtrl = require('../db/transaction.ctrl')
const Logger = require('../logger')

const OrderCtrl = {}

OrderCtrl.createOrder = (req, res) => {
  OrderCtrl.validateParams(req)
  .then(() => {
    OrderCtrl.beginOrderCreation(req, res)
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res, '002')
  })
}

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
  OrderCtrl.getChangellyAddress(req.params.from, 'nav', req.params.navAddress)
  .then((address) => {
    req.params.changellyAddressOne = address
    OrderCtrl.getSecondChangellyAddress(req, res)
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res, '004')
  })
}

OrderCtrl.getSecondChangellyAddress = (req, res) => {
  OrderCtrl.getChangellyAddress('nav', req.params.to, req.params.address)
  .then((address) => {
    req.params.changellyAddressTwo = address
    OrderCtrl.prepForDb(req, res)
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res, '005')
  })
}

OrderCtrl.prepForDb = (req, res) => {
  req.params.polymorphPass = keygen.generateKey(16)
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
  TransactionCtrl.internal.createTransaction(req, res)
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

OrderCtrl.validateParams = (req) => {
  return new Promise((fulfill, reject) => {
    // TODO: Add validation for extraId
    if (typeof req.params.from === typeof 'string' && typeof req.params.to === typeof 'string'
    && typeof req.params.address === typeof 'string' && !isNaN(parseFloat(req.params.amount))) {
      fulfill()
    }
    reject(new Error('Incorrect parameters'))
  })
}

OrderCtrl.getNavAddress = () => {
  return new Promise((fulfill, reject) => {
    GetNewAddress.internal.getNewAddress()
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
    ChangellyCtrl.internal.generateAddress({
      from: inputCurrency,
      to: outputCurrency,
      address: destAddress,
      extraId: null,
    })
    .then((data) => {
      if (data instanceof Error) {
        console.log(data, 'Couldn\'t get address from Changelly')
        reject(data)
      }
      fulfill(data.result.address)
    })
  })
}

OrderCtrl.generateOrderId = () => {
  return new Promise((fulfill, reject) => {
    const polymorphId = keygen.generateKey(16)
    TransactionCtrl.internal.checkIfIdExists(polymorphId)
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

OrderCtrl.handleError = (error, res, code) => {
  const statusMessage = 'Unable to create Polymorph Order'
  res.send(JSON.stringify({
    statusCode: 200,
    type: 'FAIL',
    code: 'ORDER_CTRL_' + code || '001',
    statusMessage,
    error,
  }))
  Logger.writeLog(code, statusMessage, error, true)
}
module.exports = OrderCtrl
