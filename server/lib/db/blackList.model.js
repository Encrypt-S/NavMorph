const mongoose = require('mongoose')

// Define schema

const Schema = mongoose.Schema

const BlackList = new Schema({
  ip_address: { type: String, required: true },
  timestamp: { type: Date, required: true },
})

// Compile model from schema
let BlackListModel = mongoose.model('BlackList', BlackList) //eslint-disable-line

module.exports = BlackListModel
