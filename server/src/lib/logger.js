'use strict'

const nodemailer = require('nodemailer')
const config = require('../server-settings')

const settings = config.mailSettings

const emailAuth = encodeURIComponent(settings.smtp.user) + ':' + encodeURIComponent(settings.smtp.pass)

const logger = {}

logger.transporter = nodemailer.createTransport('smtps://' + emailAuth + '@' + settings.smtp.server)

logger.writeLog = (logMessage, emailSubject, sendEmail = false) => {
  if (sendEmail && process.env.NODE_ENV === 'production') {
    logger.sendEmail(logMessage, emailSubject)
  }
  let logString = '\r\n-----------------------------------------------------------\r\n'
  logString += 'Date: ' + new Date() + '\r\n'
  logString += 'Log Message: ' + logMessage + '\r\n'
  logString += '-----------------------------------------------------------\r\n'
  console.log(logString)
}

logger.writeErrorLog = (errorCode, errorMessage, data, sendEmail = false) => {
  if (sendEmail && process.env.NODE_ENV === 'production') {
    logger.sendEmail(errorMessage, errorCode, data)
  }
  let logString = '\r\n-----------------------------------------------------------\r\n'
  logString += 'Date: ' + new Date() + '\r\n'
  logString += 'Error Code: ' + errorCode + '\r\n'
  logString += 'Error Message: ' + errorMessage + '\r\n'
  logString += 'Stack: ' + JSON.stringify(data) + '\r\n'

  // for (const key in data) {
  //   if (data.hasOwnProperty(key)) {
  //     let string = data[key]
  //     if (typeof data[key] === 'object') string = JSON.stringify(data[key])
  //     logString += key + ': ' + string
  //   }
  // }
  logString += '\r\n-----------------------------------------------------------\r\n'
  console.log(logString)
}

logger.sendEmail = (message, emailSubject, data) => {
  const mailOptions = {
    from: '"NavMorph System" <' + settings.smtp.user + '>',
    to: settings.notificationEmail,
    subject: `'NavMorph System Message - ${subject}`,
    text: message,
  }
  if (data) {
    mailOptions.attachments = [
      {
        filename: 'data.json',
        content: JSON.stringify(data),
      },
    ]
  }

  logger.transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('nodemail error', error)
    }
    return console.log('nodemail success: ' + info.response)
  })
}

module.exports = logger
