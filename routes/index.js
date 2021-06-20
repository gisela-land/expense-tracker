const express = require('express')
const router = express.Router()

const home = require('./modules/home.js')
const record = require('./modules/record.js')

router.use('/', home)
router.use('/records', record)

module.exports = router
