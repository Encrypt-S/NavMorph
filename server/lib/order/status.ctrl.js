const TransactionCtrl = require('../db/transaction.ctrl')
const LoginCtrl = require('../db/login.ctrl')
const ConfigData = require('../../config')
const Logger = require('../logger')

const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = (req, res) => {
  const params = req.params
  const ipAddress = req.connection.remoteAddress
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
    LoginCtrl.checkIpBlocked(ipAddress)
  .then((isBlocked) => {
    if (isBlocked) {
      LoginCtrl.insertAttempt(ipAddress, polymorphId, params)
      .then(OrderStatusCtrl.sendEmptyResponse(res))
      .catch(error => OrderStatusCtrl.handleError(error, res, '002'))
    } else {
      OrderStatusCtrl.getOrderFromDb(params, ipAddress, polymorphId, orderPassword, res)
    }
  })  
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '001') })
}

OrderStatusCtrl.getOrderFromDb = (params, ipAddress, polymorphId, orderPassword, res) => {
  TransactionCtrl.internal.getOrder(polymorphId, orderPassword)
  .then((order) => {
    if (order.length === 0) { 
      OrderStatusCtrl.checkForSuspiciousActivity(ipAddress, polymorphId, params, res)  
    } else if (order[0].order_status === 'abandoned') {
      OrderStatusCtrl.sendEmptyResponse(res)
    } else {
      res.send(order)
    }
  })
  .catch(error => OrderStatusCtrl.handleError(error, res, '003'))
}

OrderStatusCtrl.checkForSuspiciousActivity = (ipAddress, polymorphId, params, res) => {
  LoginCtrl.insertAttempt(ipAddress, polymorphId, params)
  .then(LoginCtrl.checkIfSuspicious(ipAddress)
    .then((isSuspicious) => {
      if (isSuspicious) {
        LoginCtrl.blackListIp(ipAddress)
        .then(OrderStatusCtrl.sendEmptyResponse(res))
        .catch(error => OrderStatusCtrl.handleError(error, res, '004'))
      } else {
        OrderStatusCtrl.sendEmptyResponse(res)              
      }
    })
    .catch(error => OrderStatusCtrl.handleError(error, res, '005'))
  )
  .catch(error => OrderStatusCtrl.handleError(error, res, '006'))
}

OrderStatusCtrl.sendEmptyResponse = (res) => {
  res.send([])
}


OrderStatusCtrl.updateOrderStatus = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  const newStatus = req.params.status
  if (ConfigData.validOrderStatuses.indexOf(newStatus) === -1) {
    OrderStatusCtrl.handleError(new Error('Invalid order status'), res, '007')
  }
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, newStatus)
  .then((order) => { res.send(order) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '008') })
}

OrderStatusCtrl.abandonOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, 'abandoned')
  .then(() => { res.send({ status: 'SUCCESS' }) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '009') })
}

OrderStatusCtrl.handleError = (error, res, code) => {
  const statusMessage = 'Unable to fetch/update Polymorph Order'
  res.send(JSON.stringify({
    statusCode: 200,
    type: 'FAIL',
    code: 'ORDER_STATUS_CTRL_' + code || '000',
    statusMessage,
    error,
  }))
  Logger.writeLog(code, statusMessage, error, true)
}

module.exports = OrderStatusCtrl
