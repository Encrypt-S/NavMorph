const TransactionCtrl = require('../db/transaction.ctrl')

const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  TransactionCtrl.internal.getOrder(polymorphId, orderPassword)
  .then((order) => {
    if (order[0].order_status === 'abandoned') {
      res.send([])
    }
    res.send(order)
  })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '001') })
}

// TODO
OrderStatusCtrl.updateOrderStatus = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  const newStatus = req.params.status
  // check status is valid
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, newStatus)
  .then((order) => { res.send(order) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '004') })
}

OrderStatusCtrl.abandonOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, 'abandoned')
  .then(() => { res.send('SUCCESS') })
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
