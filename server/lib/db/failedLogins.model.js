const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const mongoDB = 'mongodb://127.0.0.1/polymorph'
mongoose.createConnection(mongoDB)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

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
