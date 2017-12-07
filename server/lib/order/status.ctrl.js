"use strict";

const TransactionCtrl = require('../db/transaction.ctrl')
const EtaCtrl = require('./eta.ctrl')
const configData = require('../../../server-settings.json')
const LoginCtrl = require('../db/login.ctrl')
const Logger = require('../logger')

const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = (req, res) => {
  const params = req.params
  const ipAddress = req.ip
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
    LoginCtrl.checkIpBlocked(ipAddress)
  .then((isBlocked) => {
    if (isBlocked) {
      LoginCtrl.insertAttempt(ipAddress, polymorphId, params)
      .then(OrderStatusCtrl.sendBlockedResponse(res))
      .catch(error => OrderStatusCtrl.handleError(error, res, '002'))
    } else {
      OrderStatusCtrl.checkOrderExists(params, ipAddress, polymorphId, orderPassword, res)
    }
  })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '001') })
}



OrderStatusCtrl.checkOrderExists = (params, ipAddress, polymorphId, orderPassword, res) => {
  TransactionCtrl.internal.checkIfIdExists(polymorphId)
  .then((orderExists) => {
    if (orderExists) {
      OrderStatusCtrl.getOrderFromDb(params, ipAddress, polymorphId, orderPassword, res)
    } else if (orderArr[0].length === 0) {
      res.send([[],[]])
      return
    }
  })
  .catch(error => OrderStatusCtrl.handleError(error, res, '003'))
}


OrderStatusCtrl.getOrderFromDb = (params, ipAddress, polymorphId, orderPassword, res) => {
  TransactionCtrl.internal.getOrder(polymorphId, orderPassword)
  .then((orderArr) => {
    const order = orderArr[0]
    if (!order) {
      OrderStatusCtrl.checkForSuspiciousActivity(ipAddress, polymorphId, params, res)
    } else if (order.order_status === 'ABANDONED') {
      OrderStatusCtrl.sendEmptyResponse(res)
    } else {
      EtaCtrl.getEta(order.order_status, order.sent, order.input_currency, orderArr.output_currency)
      .then((eta) => {
        res.send([order, eta])
      })
      .catch(error => OrderStatusCtrl.handleError(error, res, '010'))
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
        .then(OrderStatusCtrl.sendBlockedResponse(res))
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

OrderStatusCtrl.sendBlockedResponse = (res) => {
  res.send(['BLOCKED'])
}


OrderStatusCtrl.updateOrderStatus = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  const newStatus = req.params.status
  if (configData.validOrderStatuses.indexOf(newStatus) === -1) {
    OrderStatusCtrl.handleError(new Error('Invalid order status'), res, '007')
  }
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, newStatus)
  .then((order) => { res.send(order) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '008') })
}

OrderStatusCtrl.abandonOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, 'ABANDONED')
  .then(() => { res.send({ status: 'SUCCESS' }) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '009') })
}

OrderStatusCtrl.handleError = (err, res, code) => {
  const statusMessage = 'Unable to fetch/update Polymorph Order'
  res.send(JSON.stringify({
    statusCode: 200,
    type: 'FAIL',
    code: 'ORDER_STATUS_CTRL_' + code || '000',
    statusMessage,
    err,
  }))
  Logger.writeLog(code, statusMessage, { error: err }, true)
}

module.exports = OrderStatusCtrl
