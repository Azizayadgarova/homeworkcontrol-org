const express = require('express')
const router = express.Router()
const {
	createUser,
	updateUser,
	deleteUser,
} = require('../controllers/admin.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')

router.use(authMiddleware(['admin'])) // faqat admin ruxsat

router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

module.exports = router
