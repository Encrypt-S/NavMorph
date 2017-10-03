const lodash = require('lodash')
const Logger = require('../logger')

// Compile model from schema
const TransactionModel = require('./transaction.model')

const TransactionCtrl = { internal: {} }

TransactionCtrl.handleError = (err, res, code, message) => {
  res.send(JSON.stringify({
    status: 200,
    type: 'FAIL',
    code,
    message,
    err,
  }))
  Logger.writeLog(code, message, { error:err }, false)
}

TransactionCtrl.internal.createTransaction = (req, res) => {
  return new Promise((fulfill, reject) => {
    const required = ['from', 'to', 'address', 'amount', 'extraId', 'polymorphId',
      'polymorphPass', 'changellyAddressOne', 'changellyAddressTwo', 'navAddress']
    if (!req || lodash.intersection(Object.keys(req.params), required).length !== required.length) {
      reject(new Error('params_error', 'TC_001', 'Failed to receive params'))
      return
    }

    TransactionCtrl.runtime = { req, res }

    TransactionCtrl.runtime.transaction = new TransactionModel({
      changelly_id: req.params.changellyId || '123123123',
      polymorph_id: req.params.polymorphId,
      polymorph_pass: req.params.polymorphPass,
      changelly_address_one: req.params.changellyAddressOne,
      changelly_address_two: req.params.changellyAddressTwo,
      order_amount: req.params.amount,
      nav_address: req.params.navAddress,
      input_currency: req.params.from,
      output_currency: req.params.to,
      output_address: req.params.address,
      order_status: 'CREATED',
      delay: req.params.delay || 0,
      created: new Date(),
      sent: null,
    })
    try {
      TransactionCtrl.runtime.transaction.save()
      .then(fulfill())
      .catch((result) => {
        if (result instanceof Error) {
          reject(result)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

TransactionCtrl.createTransaction = (req, res) => {
  const required = ['from', 'to', 'address', 'amount', 'extraId', 'polymorphId',
    'polymorphPass', 'changellyAddressOne', 'changellyAddressTwo', 'navAddress']
  if (!req.body || lodash.intersection(Object.keys(req.body), required).length !== required.length) {
    TransactionCtrl.handleError('params_error', res, 'TC_001', 'Failed to receive params')
    return
  }

  TransactionCtrl.runtime = { res, req }

  TransactionCtrl.runtime.transaction = new TransactionModel({
    changelly_id: req.body.changelly_id || '123123123',
    polymorph_id: req.body.polymorph_id,
    polymorph_pass: req.body.polymorph_pass,
    changelly_address_one: req.body.changellyAddressOne,
    changelly_address_two: req.body.changellyAddressTwo,
    order_amount: req.body.amount,
    nav_address_one: req.body.navAddress,
    input_currency: req.body.source_currency,
    output_currency: req.body.output_currency,
    output_address: req.body.output_address,
    order_status: 'CREATED',
    delay: req.body.delay || 0,
    created: new Date(),
    sent: undefined,
  })
  try {
    TransactionCtrl.runtime.transaction.save(TransactionCtrl.savedTransaction)
  } catch (error) {
    TransactionCtrl.handleError(error, res, 'TC_002', 'Failed to insert into database')
  }
}

TransactionCtrl.savedTransaction = (err) => {
  if (err) {
    TransactionCtrl.handleError(err, TransactionCtrl.runtime.res, 'TC_002', 'Failed to save transaction')
    return
  }
  TransactionCtrl.runtime.res.send(JSON.stringify({
    status: 200,
    type: 'SUCCESS',
    data: TransactionCtrl.runtime.transaction,
  }))
}

TransactionCtrl.internal.getOrder = (id, pass) => {
  return new Promise((fulfill, reject) => {
    const query = TransactionModel.find()
    if (!id || !pass) {
      reject(new Error('Id or Password missing. Id: ' + id + '. Pass: ' + pass))
    }
    query.and([{ polymorph_id: id }, { polymorph_pass: pass }])
    .select('-_id polymorph_id polymorph_pass changelly_address_one changelly_id order_amount input_currency output_currency order_status')
    .exec()
    .then((order) => { fulfill(order) })
    .catch((error) => { reject(error) })
  })
}

TransactionCtrl.internal.updateOrderStatus = (id, pass, newStatus) => {
  return new Promise((fulfill, reject) => {
    if (!id || !pass || !newStatus) {
      reject(new Error('Id, Password or Status missing. Id: ' + id + '. Pass: ' + pass + '. Status: ' + newStatus))
    }
    const query = { polymorph_id: id, polymorph_pass: pass }
    TransactionModel.findOneAndUpdate(query, { order_status: 'ABANDONED' })
    .then((data) => {
      fulfill()
    })
    .catch((error) => { reject(error) })
  })
}

TransactionCtrl.getTransaction = (req, res) => {
  TransactionCtrl.runtime = { res, req }
  const query = TransactionModel.find()
  if (req.params && req.params.id) {
    query.where('_id').equals(req.params.id)
  }
  query.exec(TransactionCtrl.gotTransaction)
}

TransactionCtrl.gotTransaction = (err, transactions) => {
  if (err) {
    TransactionCtrl.handleError(err, TransactionCtrl.runtime.res, 'TC_003', 'Failed to get transaction')
    return
  }
  TransactionCtrl.runtime.res.send(JSON.stringify({
    status: 200,
    type: 'SUCCESS',
    data: transactions,
  }))
}

TransactionCtrl.internal.checkIfIdExists = (polymorphId) => {
  return new Promise((fulfill, reject) => {
    const query = TransactionModel.find()
    try {
      if (polymorphId) {
        query.where('polymorph_id').equals(polymorphId)
      }
      query.exec()
      .then((result) => {
        if (result.length !== 0) {
          fulfill(true)
          return
        }
        fulfill(false)
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = TransactionCtrl
