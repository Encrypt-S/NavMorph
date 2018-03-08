const validator = require('validator')
const lodash = require('lodash')

const OptionsValidator = {}

OptionsValidator.startValidation = (params, options) => {
  const errors = []
  return new Promise((fulfill, reject) => {
    if (lodash.intersection(Object.keys(params), Object.keys(options)).length !== Object.keys(options).length) {
      return reject(new Error('PARAMS_ERROR'))
    }
    try {
      for (const key of Object.keys(params)) {
        OptionsValidator.validateParams(params[key], options[key], errors)
      }
    } catch (exception) {
      errors.push(exception)
    }

    if (errors.length > 0) {
      return reject(errors)
    }
    fulfill()
  })
}

OptionsValidator.validateParams = (param, validators, errors) => {
  validators.forEach(validation => {
    switch (validation.validator) {
      case 'isString':
        OptionsValidator.isString(param, validation, errors)
        break
      case 'isNumber':
        OptionsValidator.isNumber(param, validation, errors)
        break
      default:
        break
    }
  })
}

OptionsValidator.isString = (param, validation, errors) => {
  if (!(typeof param === 'string')) {
    errors.push({ err: 'STR_NON_STRING', param, validation })
    return
  }

  if (validator.shouldBeAlphanumeric && !validator.isAlphanumeric(param)) {
    errors.push({ err: 'STR_NON_ALPHANUM', param, validation })
  }

  if (validator.maxLength && validator.maxLength < param.length) {
    errors.push({ err: 'STR_MAX_LENGTH', param, validation })
  }
  if (validator.minLength && validator.minLength > param.length) {
    errors.push({ err: 'STR_MIN_LENGTH', param, validation })
  }
}

OptionsValidator.isNumber = (param, validation, errors) => {
  if (!validator.isNumeric(param) && !validator.isDecimal(param)) {
    errors.push({ err: 'NUM_NON_NUMBER', param, validation })
  }
}

module.exports = OptionsValidator
