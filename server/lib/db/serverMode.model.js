const mongoose = require('mongoose')

// Define schema

const Schema = mongoose.Schema

const serverMode = new Schema({
  server_mode: { type: String, required: true }
})

// Compile model from schema
let ServerModeModel = mongoose.model('serverMode', serverMode) //eslint-disable-line

module.exports = ServerModeModel
