const keygen = require('generate-key')

const getNewAddress = require('../rpc/get-new-address')
const ChangellyCtrl = require('../changelly/changelly.ctrl')
const TransactionCtrl = require('../db/transaction.ctrl')

const OrderCtrl = {}

OrderCtrl.createOrder = (req, res) => {
  OrderCtrl.getNavAddress(res).then((address) => {
    if (address instanceof Error) {
      OrderCtrl.handleError(address, res)
    }
    req.params.navAddressOne = address
    OrderCtrl.getFirstChangellyAddress(req, res)
  })
}

OrderCtrl.getFirstChangellyAddress = async (req, res) => {
  const address = await OrderCtrl.getChangellyAddress(req.params.from, 'nav', req.params.navAddressOne)
  if (address instanceof Error) {
    OrderCtrl.handleError(address, res)
  }
  req.params.changellyAddressOne = address
  OrderCtrl.prepForDb(req, res)
}

OrderCtrl.prepForDb = async (req, res) => {
  req.params.polymorphPass = keygen.generateKey(16)
  req.params.polymorphId = '001'
  req.params.changellyId = '001'
  const errorExists = await TransactionCtrl.internal.createTransaction(req, res)
  if (errorExists instanceof Error) {
    OrderCtrl.handleError(errorExists, res)
    return
  }
  res.send({
    result: [req.params.polymorphId, req.params.polymorphPass],
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

OrderCtrl.getChangellyAddress = async (inputCurrency, outputCurrency, destAddress) => {
  const data = await ChangellyCtrl.internal.generateAddress({
    from: inputCurrency,
    to: outputCurrency,
    address: destAddress,
    extraId: null,
  })
  if (data instanceof Error) {
    console.log(data, 'Couldn\'t get address from Changelly')
    data.message = 'Couldn\'t get address from Changelly'
    return data
  }
  return data.result.address
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
    message: 'something went wrong',
    error,
    data: ['test', 'test'],
  }))
  console.log('sent error response')
}
module.exports = OrderCtrl
