// Get dependencies
const express = require('express')
const path = require('path')
const https = require('https')
const bodyParser = require('body-parser')
const pem = require('pem')

// Get our API routes
const api = require('./server/routes/api')

const app = express()

// Parsers for POST data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')))

// Set our api routes
app.use('/api', api)

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000'
app.set('port', port)

/**
 * Create HTTPS server.
 */

pem.createCertificate({ days: 1, selfSigned: true }, (error, keys) => {
  if (error) {
    console.log('pem error: ' + error)
  }
  const sslOptions = {
    key: keys.serviceKey,
    cert: keys.certificate,
    requestCert: false,
    rejectUnauthorized: false,
  }
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true,
  }))
  https.createServer(sslOptions, app).listen(port, () =>
    console.log(`API running on https://localhost:${port}`))
})
