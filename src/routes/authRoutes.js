const express = require('express')
const router = express.Router()
const {
	register,
	login,
	linkParentStudent,
	getParentChildren,
} = require('../controllers/authController')
const { protect } = require('../middlewares/authMiddleware')
const { authorizeRoles } = require('../middlewares/roleMiddleware')

// TEMP: first admin creation
router.post('/create-admin', async (req, res) => {
	const { name, phone, password } = req.body
	const User = require('../models/User')
	const exists = await User.findOne({ phone })
	if (exists) return res.status(400).json({ message: 'Admin already exists' })
	const user = await User.create({ name, phone, password, role: 'admin' })
	res.status(201).json({ message: 'Admin created', user })
})

// User register (admin only)
router.post('/register', protect, authorizeRoles('admin'), register)

// Login
router.post('/login', login)

// Parent-student link
router.post(
	'/link-parent-student',
	protect,
	authorizeRoles('admin'),
	linkParentStudent
)
router.get(
	'/parent/:parentId/children',
	protect,
	authorizeRoles('parent'),
	getParentChildren
)

module.exports = router
