'use strict'

const TransactionCtrl = require('../db/transaction.ctrl')
const EtaCtrl = require('./eta.ctrl')
const LoginCtrl = require('../db/login.ctrl')
const Validator = require('../options-validator')
const ConfigData = require('../../server-settings')
const ApiOptions = require('../../api-options.json')
let ErrorHandler = require('../error-handler') // eslint-disable-line prefer-const


const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = (req, res) => {
  const params = req.params
  params.ipAddress = req.ip
  OrderStatusCtrl.validateParams(params, ApiOptions.getOrderStatusOptions)
  .then(() => {
    LoginCtrl.checkIpBlocked({ ipAddress: params.ipAddress })
    .then((isBlocked) => {
      if (isBlocked) {
        LoginCtrl.insertAttempt(params.ipAddress, params.polymorphId)
        .then(OrderStatusCtrl.sendBlockedResponse(res))
        .catch(error => ErrorHandler.handleError({
          statusMessage: 'Unable to fetch/update Polymorph Order',
          code: 'ORDER_STATUS_CTRL_002',
          err: error,
          sendEmail: true,
          res
        }))
      } else {
        OrderStatusCtrl.getOrderFromDb(params, res)
      }
    })
    .catch((error) => { ErrorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_003',
      err: error,
      sendEmail: true,
      res
    })
   })
  })
  .catch((error) => {
    ErrorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_001',
      err: error,
      sendEmail: true,
      res
    })
  })
}

OrderStatusCtrl.getOrderFromDb = (params, res) => {
  TransactionCtrl.getOrder(params.orderId, params.orderPassword)
  .then((orderArr) => {
    const order = orderArr[0]
    if (!order) {
      OrderStatusCtrl.checkForSuspiciousActivity(params, res)
    } else if (order.order_status === 'ABANDONED') {
      OrderStatusCtrl.sendEmptyResponse(res)
    } else {
      EtaCtrl.getEta({ status: order.order_status, timeSent: order.sent, from: order.input_currency, to: order.output_currency })
      .then((eta) => {
        res.send([order, eta])
      })
      .catch(error => ErrorHandler.handleError({
        statusMessage: 'Unable to fetch/update Polymorph Order',
        code: 'ORDER_STATUS_CTRL_005',
        err: error,
        sendEmail: true,
        res
      }))
    }
  })
  .catch(error => ErrorHandler.handleError({
    statusMessage: 'Unable to fetch/update Polymorph Order',
    code: 'ORDER_STATUS_CTRL_006',
    err: error,
    sendEmail: true,
    res
  }))
}

OrderStatusCtrl.checkForSuspiciousActivity = (params, res) => {
  LoginCtrl.insertAttempt(params.ipAddress, params.orderId)
  .then(LoginCtrl.checkIfSuspicious(params.ipAddress)
    .then((isSuspicious) => {
      if (isSuspicious) {
        LoginCtrl.blackListIp({ ipAddress: params.ipAddress })
        .then(OrderStatusCtrl.sendBlockedResponse(res))
        .catch(error => ErrorHandler.handleError({
          statusMessage: 'Unable to fetch/update Polymorph Order',
          code: 'ORDER_STATUS_CTRL_007',
          err: error,
          sendEmail: true,
          res
        }))
      } else {
        OrderStatusCtrl.sendEmptyResponse(res)
      }
    })
    .catch(error => ErrorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_008',
      err: error,
      sendEmail: true,
      res
    }))
  )
  .catch(error => ErrorHandler.handleError({
    statusMessage: 'Unable to fetch/update Polymorph Order',
    code: 'ORDER_STATUS_CTRL_009',
    err: error,
    sendEmail: true,
    res
  }))
}

OrderStatusCtrl.sendEmptyResponse = (res) => {
  res.send([])
}

OrderStatusCtrl.sendBlockedResponse = (res) => {
  res.send(['BLOCKED'])
}


OrderStatusCtrl.updateOrderStatus = (req, res) => {
  OrderStatusCtrl.validateParams(req.params, ApiOptions.updateOrderStatusOptions)
  .then(() => {
    const params = req.params
    const newStatus = req.params.status
    if (ConfigData.validOrderStatuses.indexOf(newStatus) === -1) {
      ErrorHandler.handleError({
        statusMessage: 'Unable to fetch/update Polymorph Order',
        code: 'ORDER_STATUS_CTRL_010',
        err: new Error('Invalid order status'),
        sendEmail: true,
        res
      })
    }
    TransactionCtrl.updateOrderStatus(params.orderId, params.orderPassword, params.newStatus)
  })
  .then((order) => { res.send(order) })
  .catch((error) => {
    ErrorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_011',
      err: error,
      sendEmail: true,
      res
    })
  })
}

OrderStatusCtrl.abandonOrder = (req, res) => {
  OrderStatusCtrl.validateParams(req.params, ApiOptions.updateOrderStatusOptions)
  .then(() => {
    const polymorphId = req.params.orderId
    const orderPassword = req.params.orderPassword
    TransactionCtrl.updateOrderStatus(polymorphId, orderPassword, 'ABANDONED')
  })
  .then(() => { res.send({ status: 'SUCCESS' }) })
  .catch((error) => {
    ErrorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_012',
      err: error,
      sendEmail: true,
      res
    })
  })
}

OrderStatusCtrl.validateParams = (params, options) => {
  return new Promise((fulfill, reject) => {
    Validator.startValidation(params, options)
    .then(() => fulfill())
    .catch((errorArr => reject(errorArr)))
  })
}

module.exports = OrderStatusCtrl
