let logger = require('./logger') // eslint-disable-line prefer-const
let validator = require('./options-validator') // eslint-disable-line prefer-const
const apiOptions = require('../api-options.json')

const ErrorHandler = {}

ErrorHandler.handleError = params => {
  // We don't  have an Error Handler Validation yet
  // console.log('ErrorHandler.handleError', params, apiOptions.ErrorHandler)
  validator
    .startValidation(params, {})
    .then(() => {
      params.res.send(
        JSON.stringify({
          statusCode: 200,
          type: 'FAIL',
          statusMessage: params.statusMessage,
          err: params.err,
        })
      )
      logger.writeErrorLog(params.code, params.statusMessage, { error: params.err }, params.sendEmail)
    })
    .catch(errorArr => {
      logger.writeErrorLog(
        'ERR_HDL_001',
        "Incorrect Params - couldn't handle error",
        { error: errorArr, originalError: params },
        true
      )
    })
}

module.exports = ErrorHandler
