const express = require('express')
const router = express.Router()
const {
	getUsersByRole,
	createUser,
	updateUser,
	deleteUser,
} = require('../controllers/userController')
const { protect, authMiddleware } = require('../middlewares/authMiddleware')

// GET users by role (faqat admin)
router.get('/', protect, authMiddleware(['admin']), getUsersByRole)

// CREATE user (faqat admin)
router.post('/', protect, authMiddleware(['admin']), createUser)

// UPDATE user (faqat admin)
router.patch('/:id', protect, authMiddleware(['admin']), updateUser)

// DELETE user (faqat admin)
router.delete('/:id', protect, authMiddleware(['admin']), deleteUser)

module.exports = router
