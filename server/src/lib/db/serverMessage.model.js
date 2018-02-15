"use strict";

const mongoose = require('mongoose')

// Define schema

const Schema = mongoose.Schema

const serverMessage = new Schema({
  server_message: { type: String, required: true },
  message_type: {type: String, required: true },
  show_message: {type: Boolean, required: true },
})

// Compile model from schema
let ServerMessageModel = mongoose.model('serverMessage', serverMessage) //eslint-disable-line

module.exports = ServerMessageModel
