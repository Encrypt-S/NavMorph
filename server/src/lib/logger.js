"use strict";

const nodemailer = require('nodemailer')
const config = require('../server-settings')

const settings = config.mailSettings

const emailAuth = encodeURIComponent(settings.smtp.user) + ':' + encodeURIComponent(settings.smtp.pass)

const Logger = {}

// Logger.transporter = nodemailer.createTransport('smtps://' + emailAuth + '@' + settings.smtp.server)


Logger.writeLog = (errorCode, errorMessage, data, sendEmail = false) => {
  if (sendEmail && process.env.NODE_ENV === 'production') {
    Logger.sendEmail(errorCode, errorMessage, data)
  }
  const date = new Date()
  let logString = '\r\n-----------------------------------------------------------\r\n'
  logString += 'Date: ' + date + '\r\n'
  logString += 'Error Code: ' + errorCode + '\r\n'
  logString += 'Error Message: ' + errorMessage + '\r\n'
  // logString += 'Error: ' + JSON.stringify(data) + '\r\n'

  // TODO WE should figure out if we need this
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

Logger.sendEmail = (errorCode, errorMessage, data) => {
  const mailOptions = {
    from: '"NavMorph System" <' + settings.smtp.user + '>',
    to: settings.notificationEmail,
    subject: 'NavMorph System Message - ' + errorCode,
    text: errorCode + ' - ' + errorMessage,
  }
  if (data) {
    mailOptions.attachments = [
      {
        filename: 'data.json',
        content: JSON.stringify(data),
      },
    ]
  }

  Logger.transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('nodemail error', error)
    }
    return console.log('nodemail success: ' + info.response)
  })
}

module.exports = Logger
