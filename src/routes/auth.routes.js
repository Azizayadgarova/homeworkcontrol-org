const express = require('express')
const router = express.Router()
const { registerAdmin, login } = require('../controllers/auth.controller')

router.post('/register-admin', registerAdmin) // faqat birinchi admin
router.post('/login', login)

module.exports = router
