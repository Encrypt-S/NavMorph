const keygen = require('generate-key')

const getNewAddress = require('../rpc/get-new-address')
const ChangellyCtrl = require('../changelly/changelly.ctrl')
const TransactionCtrl = require('../db/transaction.ctrl')

const OrderCtrl = {}

OrderCtrl.createOrder = (req, res) => {
  OrderCtrl.validateParams(res)
  .then(() => {
    OrderCtrl.beginOrderCreation(req, res)
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res, '002')
  })
}

OrderCtrl.beginOrderCreation = (req, res) => {
  OrderCtrl.getNavAddress(res)
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
    OrderCtrl.prepForDb(req, res)
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res, '004')
  })
}

OrderCtrl.prepForDb = (req, res) => {
  req.params.polymorphPass = keygen.generateKey(16)
  req.params.polymorphId = '001'
  req.params.changellyId = '001'
  TransactionCtrl.internal.createTransaction(req, res)
  .then(() => {
    res.send(JSON.stringify({
      status: 200,
      type: 'SUCCESS',
      data: [req.params.polymorphId, req.params.polymorphPass],
    }))
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res, '005')
  })
}

OrderCtrl.validateParams = (req) => {
  return new Promise((fulfill, reject) => {
    if (req.params.from instanceof String && req.params.to instanceof String && req.params.address instanceof String &&
      !isNaN(parseFloat(req.params.amount))) { // TODO: Add validation for extraId
      fulfill()
    }
    reject(new Error('Incorrect parameters'))
  })
}

OrderCtrl.getNavAddress = () => {
  return new Promise((fulfill, reject) => {
    getNewAddress.internal.getNewAddress()
    .then((newAddress) => {
      fulfill(newAddress)
    })
    .catch((error) => {
      // const err = new Error('Couldn\'t get a new address from Nav daemon')
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
        // data.tag = 'CHANGELLY_ERR'
        reject(data)
      }
      fulfill(data.result.address)
    })
  })
}

OrderCtrl.getOrder = (req, res) => {
  const polymorphId = req.params.orderId
  console.log('Get Order ', polymorphId)
  res.send()
}

OrderCtrl.getOrderStatus = (req, res) => {
  const polymorphId = req.params.orderId
  console.log('Order Status', polymorphId)
  res.send()
}

OrderCtrl.abandonOrder = (req, res) => {
  const polymorphId = req.params.orderId
  console.log('Abandon Order', polymorphId)
  res.send()
}

OrderCtrl.handleError = (error, res, code) => {
  res.send(JSON.stringify({
    statusCode: 200,
    type: 'FAIL',
    code: 'ORDER_CTRL_' + code || '001',
    statusMessage: 'Unable to create Polymorph Order',
    error,
  }))
  console.log('Error: ' + error)
}
module.exports = OrderCtrl
