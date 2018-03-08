'use strict'

const mongoose = require('mongoose')

// Define schema

const Schema = mongoose.Schema

const failedLogin = new Schema({
  ip_address: { type: String, required: true },
  polymorph_id: { type: String, required: true },
  timestamp: { type: Date, required: true },
  params: { type: String, required: true },
})

// Compile model from schema
let failedLoginModel = mongoose.model('failedLogin', failedLogin) //eslint-disable-line

module.exports = failedLoginModel
