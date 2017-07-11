const TransactionCtrl = require('../db/transaction.ctrl')
const configData = require('../../config')

const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  TransactionCtrl.internal.getOrder(polymorphId, orderPassword)
  .then((order) => {
    if (order[0].order_status === 'abandoned') {
      res.send([])
    } else {
      res.send(order)
    }
  })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '001') })
}

OrderStatusCtrl.updateOrderStatus = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  const newStatus = req.params.status
  if (configData.validOrderStatuses.indexOf(newStatus) === -1) {
    OrderStatusCtrl.handleError(new Error('Invalid order status'), res, '006')
  }
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, newStatus)
  .then((order) => { res.send(order) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '004') })
}

OrderStatusCtrl.abandonOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, 'abandoned')
  .then(() => { res.send({ status: 'SUCCESS' }) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '005') })
}

OrderStatusCtrl.handleError = (error, res, code) => {
  res.send(JSON.stringify({
    statusCode: 200,
    type: 'FAIL',
    code: 'ORDER_STATUS_CTRL_' + code || '000',
    statusMessage: 'Unable to fetch/update Polymorph Order',
    error,
  }))
  console.log(error)
}

module.exports = OrderStatusCtrl
