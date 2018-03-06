const transactionCtrl = require('../db/transaction.ctrl')
const etaCtrl = require('./eta.ctrl')
const loginCtrl = require('../db/login.ctrl')
const validator = require('../options-validator')
const configData = require('../../server-settings')
const apiOptions = require('../../api-options.json')
let errorHandler = require('../error-handler') // eslint-disable-line prefer-const


const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = async (req, res) => {
  try {
    const params = {params: req.params, ipAddress: req.ip }
    await validator.startValidation(params, options)
    const isIpBlocked = await loginCtrl.checkIpBlocked({ ipAddress: params.ipAddress })
    if (isIpBlocked) {
      await loginCtrl.insertAttempt(params.ipAddress, params.polymorphId)
      return OrderStatusCtrl.sendBlockedResponse(res)
    } else {
      return OrderStatusCtrl.checkOrderExists(params, res)
    }
  } catch(err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_001',
      err,
      sendEmail: true,
      res
    })
  }
}


OrderStatusCtrl.checkOrderExists = async (params, res) => {
  try {
    const orderIdExists = await transactionCtrl.checkIfIdExists(params.orderId)
    if (orderIdExists) {
      return OrderStatusCtrl.getOrderFromDb(params, res)
    } else {
      return res.send([[], []])
    }
  } catch (err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_002',
      err,
      sendEmail: true,
      res
    })
  }
}

OrderStatusCtrl.getOrderFromDb = async (params, res) => {
  try {
    const orderArray = await transactionCtrl.getOrder(params.orderId, params.orderPassword)
    const order = orderArr[0]
    if (!order) {
      return OrderStatusCtrl.checkForSuspiciousActivity(params, res)
    } else if (order.order_status === 'ABANDONED') {
      return OrderStatusCtrl.sendEmptyResponse(res)
    } else {
      const orderEta = await etaCtrl.getEta({ status: order.order_status, timeSent: order.sent, from: order.input_currency, to: order.output_currency })
      return res.send([order, eta])
    }
  } catch (err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_003',
      err,
      sendEmail: true,
      res
    })
  }
}

OrderStatusCtrl.checkForSuspiciousActivity = async (params, res) => {
  try {
    await loginCtrl.insertAttempt(params.ipAddress, params.orderId)
    const isSuspicious = await loginCtrl.checkIfSuspicious(params.ipAddress)
    if (isSuspicious) {
      await loginCtrl.blackListIp({ ipAddress: params.ipAddress })
      return OrderStatusCtrl.sendBlockedResponse(res)
    } else {
      return OrderStatusCtrl.sendEmptyResponse(res)
    }
  } catch (err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_004',
      err,
      sendEmail: true,
      res
    })
  }
}

OrderStatusCtrl.sendEmptyResponse = (res) => res.send([])

OrderStatusCtrl.sendBlockedResponse = (res) => res.send(['BLOCKED'])

OrderStatusCtrl.updateOrderStatus = async (req, res) => {
  try {
    await validator.startValidation(req.params, apiOptions.updateOrderStatusOptions)
    const params = req.params
    const newStatus = req.params.status
    console.log('params', params)
    console.log('newStatus', newStatus)
    if (configData.validOrderStatuses.indexOf(newStatus) === -1) {
      errorHandler.handleError({
        statusMessage: 'Unable to fetch/update Polymorph Order',
        code: 'ORDER_STATUS_CTRL_005',
        err: new Error('Invalid order status'),
        sendEmail: true,
        res
      })
    }
    const order = await transactionCtrl.updateOrderStatus(params.orderId, params.orderPassword, params.newStatus)
    return res.send(order)
  } catch(err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_011',
      err: err,
      sendEmail: true,
      res
    })
  }
}

OrderStatusCtrl.abandonOrder = async (req, res) => {
  try {
    await validator.startValidation(req.params, apiOptions.updateOrderStatusOptions)
    await transactionCtrl.updateOrderStatus(req.params.orderId, req.params.orderPassword, 'ABANDONED')
    return res.send({ status: 'SUCCESS' })
  } catch(err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_012',
      err: err,
      sendEmail: true,
      res
    })
  }
}

module.exports = OrderStatusCtrl
