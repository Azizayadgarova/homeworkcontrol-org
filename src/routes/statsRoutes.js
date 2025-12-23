const express = require('express')
const router = express.Router()

const { getStats } = require('../controllers/statsController') // 🔴 destructuring

router.get('/', getStats) // 🔴 undefined bo‘lmasligi shart

module.exports = router
