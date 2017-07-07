const TransactionCtrl = require('../db/transaction.ctrl')

const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  console.log('Get Order ', polymorphId)
  TransactionCtrl.internal.getOrder(polymorphId, orderPassword)
  .then((order) => { res.send(order) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '001') })
}

// TODO
OrderStatusCtrl.getOrderETA = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.password
  TransactionCtrl.internal.getOrder(polymorphId, orderPassword)
  .then((order) => { res.send(order) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '002') })
}

// TODO
OrderStatusCtrl.updateOrderStatus = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  const newStatus = req.params.status
  //check status is valid
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, newStatus)
  .then((order) => { res.send(order) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '003') })
}

OrderStatusCtrl.abandonOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.password
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, 'abandoned')
  .then((order) => { res.send(order) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '004') })
}

OrderStatusCtrl.handleError = (error, res, code) => {
  res.send(JSON.stringify({
    statusCode: 200,
    type: 'FAIL',
    code: 'ORDER_STATUS_CTRL_' + code || '000',
    statusMessage: 'Unable to create Polymorph Order',
    error,
  }))
  console.log(error)
}

module.exports = OrderStatusCtrl
