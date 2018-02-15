const serverSettingsTemplate = require('../server-settings-template.json')

const NUMBER_TWO_DECIMALS = /^(\d+)?([.]?\d{0,2})?$/

const SettingsValidator = {
  errors: [],
}

SettingsValidator.validateSettings = (serverSettings) => {
  return new Promise((resolve, reject) => {
    SettingsValidator.errors = []
    validate(serverSettings, serverSettingsTemplate)
    if (SettingsValidator.errors.length < 1) {
      resolve()
    } else {
      reject('Error: invalid server config - ' + SettingsValidator.errors)
    }
  })
}

function validate(value, validation, currentKey) {
  if (typeof value === 'object' && !(value instanceof Array)) {
    for (const key in validation) {
      if (validation.hasOwnProperty(key)) {
        validate(value[key], validation[key], key)
      }
    }
  } else {
    eachField(value, validation, currentKey)
  }
}

function eachField(value, validation, currentKey) {
  // console.log(value, validation, currentKey)
  if (validation === true && !value) {
    SettingsValidator.errors.push('VALUE_IS_REQUIRED for ' + currentKey, value)
    return
  }
  if (validation === false && (!value || value === undefined)) {
    return
  }

  if (!value || value === undefined) {
    SettingsValidator.errors.push('MISSING_VALUE for ' + currentKey + ', must provide a valid value')
    return
  }

  switch (validation) {
    case 'PORT':
      validatePort(value, validation, currentKey)
      break
    case 'NUMBER':
      validateNumber(value, validation, currentKey)
      break
    case 'STRING':
      validateString(value, validation, currentKey)
      break
    case 'ARRAY':
      validateArray(value, validation, currentKey)
    break
    case 'BOOLEAN':
      validateBoolean(value, validation, currentKey)
    break
    default:
      SettingsValidator.errors.push('NO_VALIDATION_SET for ' + currentKey)
  }
}

function validatePort(value, validation, key) {
  const integer = parseInt(value, 10)
  if (integer < 1 || integer > 65535) {
    SettingsValidator.errors.push('PORT_OUT_OF_RANGE for ' + key + ', must be between 1 and 65535 ')
    return true
  }
  return false
}

function validateNumber(value, validation, key) {

  if (typeof value === 'number') {
    return true
  }
  SettingsValidator.errors.push('INCORRECT_TYPE for ' + key + ', must be a Number. ')
  return false
}

function validateString(value, validation, key) {
  if (typeof value !== 'string') {
    SettingsValidator.errors.push(
      'INCORRECT_TYPE for ' + key + ', must be a String'
    )
    return false
  }
  return true
}

function validateBoolean(value, validation, key) {
  if (typeof value !== 'boolean') {
    SettingsValidator.errors.push(
      'INCORRECT_TYPE for ' + key + ', must be a Boolean'
    )
    return false
  }
  return true
}

function validateArray(value, validation, key) {
  if (typeof value !== 'object') {
    SettingsValidator.errors.push(
      'INCORRECT_TYPE for ' + key + ', must be an object (array)'
    )
    return false
  }
  return true
}

module.exports = SettingsValidator
