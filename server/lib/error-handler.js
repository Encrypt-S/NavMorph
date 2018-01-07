let Logger = require('./logger') // eslint-disable-line prefer-const
let Validator = require('./options-validator') // eslint-disable-line prefer-const
const ApiOptions = require('../api-options.json')

const ErrorHandler = {}

ErrorHandler.handleError = (statusMessage, err, code, sendEmail, res) => {
  const params = { statusMessage, err, code, sendEmail, res }
  Validator.startValidation(params, ApiOptions)
  .then(() => {
    res.send(JSON.stringify({
      statusCode: 200,
      type: 'FAIL',
      statusMessage,
      err,
    }))
    Logger.writeLog(code, statusMessage, { error: err }, sendEmail)
  })
  .catch((errorArr) => {
    Logger.writeLog('ERR_HDL_001', 'Incorrect Params - couldn\'t handle error', { error: errorArr, originalError: params }, true)
  })
}

module.exports = ErrorHandler
