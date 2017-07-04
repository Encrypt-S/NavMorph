const keygen = require('generate-key')

const getNewAddress = require('../rpc/get-new-address')
const ChangellyCtrl = require('../changelly/changelly.ctrl')
const TransactionCtrl = require('../db/transaction.ctrl')

const OrderCtrl = {}

OrderCtrl.createOrder = (req, res) => {
  OrderCtrl.getNavAddress(res)
  .then((address) => {
    req.params.navAddressOne = address
    OrderCtrl.getFirstChangellyAddress(req, res)
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res)
  })
}

OrderCtrl.getFirstChangellyAddress = (req, res) => {
  OrderCtrl.getChangellyAddress(req.params.from, 'nav', req.params.navAddressOne)
  .then((address) => {
    req.params.changellyAddressOne = address
    OrderCtrl.prepForDb(req, res)
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res)
  })
}

OrderCtrl.prepForDb = (req, res) => {
  req.params.polymorphPass = keygen.generateKey(16)
  req.params.polymorphId = '001'
  req.params.changellyId = '001'
  TransactionCtrl.internal.createTransaction(req, res)
  .then(() => {
    res.send({
      result: [req.params.polymorphId, req.params.polymorphPass],
    })
  })
  .catch((error) => {
    OrderCtrl.handleError(error, res)
  })
}

OrderCtrl.getNavAddress = () => {
  const newAddress = getNewAddress.internal.getNewAddress()
  if (newAddress instanceof Error) {
    const err = new Error('Couldn\'t get a new address from Nav daemon')
    return err
  }
  return newAddress
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

OrderCtrl.handleError = (error, res) => {
  res.send(JSON.stringify({
    status: 400,
    type: 'FAIL',
    code: 'ORDER_CTRL',
    message: 'Unable to create Polymorph Order',
    error,
  }))
  console.log('sent error response')
}
module.exports = OrderCtrl
