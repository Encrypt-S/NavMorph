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
    const params = req.params
    params.ipAddress = req.ip
    await validator.startValidation(params, options)
    const isIpBlocked = await loginCtrl.checkIpBlocked({ ipAddress: params.ipAddress })
    if (isIpBlocked) {
      await loginCtrl.insertAttempt(params.ipAddress, params.polymorphId)
      await OrderStatusCtrl.sendBlockedResponse(res)
    } else {
      await OrderStatusCtrl.checkOrderExists(params, res)
    }
  } catch(error) { 
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_003',
      err: error,
      sendEmail: true,
      res
    })
  }
}


OrderStatusCtrl.checkOrderExists = async (params, res) => {
  try { 
    const orderIdExists = await transactionCtrl.checkIfIdExists(params.orderId)
    if (orderIdExists) {
      OrderStatusCtrl.getOrderFromDb(params, res)
    } else {
      res.send([[], []])
    } 
  } catch (error) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_004',
      err: error,
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
      OrderStatusCtrl.checkForSuspiciousActivity(params, res)
    } else if (order.order_status === 'ABANDONED') {
      OrderStatusCtrl.sendEmptyResponse(res)
    } else {
    const orderEta = await etaCtrl.getEta({ status: order.order_status, timeSent: order.sent, from: order.input_currency, to: order.output_currency })
      res.send([order, eta])
    }
  } catch (error) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_006',
      err: error,
      sendEmail: true,
      res
    })
  }
}

OrderStatusCtrl.checkForSuspiciousActivity = async (params, res) => {
  try {
    loginCtrl.insertAttempt(params.ipAddress, params.orderId)
    const isSuspicious = await loginCtrl.checkIfSuspicious(params.ipAddress)
    if (isSuspicious) {
      await loginCtrl.blackListIp({ ipAddress: params.ipAddress })
      await OrderStatusCtrl.sendBlockedResponse(res)
    } else {
      OrderStatusCtrl.sendEmptyResponse(res)
    }
  } catch (error) {
    errorHandler.handleError({
    statusMessage: 'Unable to fetch/update Polymorph Order',
    code: 'ORDER_STATUS_CTRL_008',
    err: error,
    sendEmail: true,
    res
    })
  }
}

OrderStatusCtrl.sendEmptyResponse = (res) => {
  res.send([])
}

OrderStatusCtrl.sendBlockedResponse = (res) => {
  res.send(['BLOCKED'])
}


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
        code: 'ORDER_STATUS_CTRL_010',
        err: new Error('Invalid order status'),
        sendEmail: true,
        res
      })
    }
    const order = await transactionCtrl.updateOrderStatus(params.orderId, params.orderPassword, params.newStatus)
    res.send(order)
  } catch(error) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_011',
      err: error,
      sendEmail: true,
      res
    })
  }
}

OrderStatusCtrl.abandonOrder = async (req, res) => {
  try {
    await validator.startValidation(req.params, apiOptions.updateOrderStatusOptions)
    await transactionCtrl.updateOrderStatus(req.params.orderId, req.params.orderPassword, 'ABANDONED')
    res.send({ status: 'SUCCESS' })
  } catch(error) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_012',
      err: error,
      sendEmail: true,
      res
    })
  }
}

module.exports = OrderStatusCtrl
