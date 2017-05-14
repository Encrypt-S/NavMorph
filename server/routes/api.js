const express = require('express')

const router = express.Router()
const Rpc = require('../lib/rpc')

router.get('/', (req, res) => res.send('api works'))
router.post('/navcoin/rpc', Rpc.navcoinRpc)

module.exports = router
