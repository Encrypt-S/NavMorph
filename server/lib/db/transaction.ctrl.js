const lodash = require('lodash')

// Compile model from schema
const TransactionModel = require('./transaction.model')

const TransactionCtrl = { internal: {} }

TransactionCtrl.handleError = (err, res, code, message) => {
  res.send(JSON.stringify({
    status: 200,
    type: 'FAIL',
    code,
    message,
    error: err,
  }))
}

TransactionCtrl.internal.createTransaction = (req, res) => {
  return new Promise((resolve, reject) => {
    const required = ['from', 'to', 'address', 'amount', 'extraId', 'changellyId',
      'polymorphId', 'polymorphPass', 'changellyAddressOne', 'navAddress']
    if (!req || lodash.intersection(Object.keys(req.params), required).length !== required.length) {
      reject(new Error('params_error', 'TC_001', 'Failed to receive params'))
    }

    TransactionCtrl.runtime = { req, res }

    TransactionCtrl.runtime.transaction = new TransactionModel({
      changelly_id: req.params.changellyId,
      polymorph_id: req.params.polymorphId,
      polymorph_pass: req.params.polymorphPass,
      changelly_address_one: req.params.changellyAddressOne,
      // changelly_address_two: req.params.changelly_address_two,
      na_address_one: req.params.navAddress,
      input_currency: req.params.from,
      output_currency: req.params.to,
      output_address: req.params.address,
      order_status: 'created',
      delay: req.params.delay || 0,
      created: new Date(),
    })
    try {
      TransactionCtrl.runtime.transaction.save()
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
  const required = ['from', 'to', 'address', 'amount', 'extraId', 'changellyId',
    'polymorphId', 'polymorphPass', 'changellyAddressOne', 'navAddress']
  if (!req.body || lodash.intersection(Object.keys(req.body), required).length !== required.length) {
    TransactionCtrl.handleError('params_error', res, 'TC_001', 'Failed to receive params')
    return
  }

  TransactionCtrl.runtime = { res, req }

  TransactionCtrl.runtime.transaction = new TransactionModel({
    changelly_id: req.body.changelly_id,
    polymorph_id: req.body.polymorph_id,
    polymorph_pass: req.body.polymorph_pass,
    changelly_address_one: req.body.changellyAddressOne,
    // changelly_address_two: req.body.changelly_address_two,
    nav_address_one: req.body.navAddress,
    input_currency: req.body.source_currency,
    output_currency: req.body.output_currency,
    output_address: req.body.output_address,
    order_status: 'created',
    delay: req.body.delay || 0,
    created: new Date(),
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

module.exports = TransactionCtrl
