const TransactionCtrl = require('../db/transaction.ctrl')
const LoginCtrl = require('../db/login.ctrl')
const ConfigData = require('../../config')
const Logger = require('../logger')

const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  LoginCtrl.checkIpBlocked(req)
  .then((isBlocked) => {
    if (isBlocked) {
      LoginCtrl.insertAttempt(req.connection.remoteAddress, polymorphId, req.params)
      .then(() => {
        res.send([])
        return
      })
      .catch(error => OrderStatusCtrl.handleError(error, res, '007'))
    } else {
      TransactionCtrl.internal.getOrder(polymorphId, orderPassword)
      .then((order) => {
        if (order.length === 0) { 
          LoginCtrl.insertAttempt(req.connection.remoteAddress, polymorphId, req.params)
          .then(LoginCtrl.checkIfSuspicious(req.connection.remoteAddress)
            .then((isSuspicious) => {
                if (isSuspicious) {
                  LoginCtrl.blackListIp(req.connection.remoteAddress)
                  .then(() => {
                    res.send([])
                  })
                  .catch(error => OrderStatusCtrl.handleError(error, res, '008'))
                } else {
                  res.send([])
                  return                
                }
              })
              .catch(error => OrderStatusCtrl.handleError(error, res, '009'))
          )
          .catch(error => OrderStatusCtrl.handleError(error, res, '010'))
        } else if (order[0].order_status === 'abandoned') {
          res.send([])
          return
        } else {
          res.send(order)
        }
      })
      .catch(error => OrderStatusCtrl.handleError(error, res, '011'))
    }
  })  
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '001') })
}

OrderStatusCtrl.updateOrderStatus = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  const newStatus = req.params.status
  if (ConfigData.validOrderStatuses.indexOf(newStatus) === -1) {
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
