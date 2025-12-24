const express = require('express')
const router = express.Router()
const {
	createGroup,
	getGroups,
	updateGroup,
	deleteGroup,
} = require('../controllers/groupController')
const { protect } = require('../middlewares/authMiddleware')
const { authorizeRoles } = require('../middlewares/roleMiddleware')

// GET all groups
router.get('/', protect, getGroups)

// POST create group
router.post('/', protect, authorizeRoles('admin'), createGroup)

// PATCH update group
router.patch('/:id', protect, authorizeRoles('admin'), updateGroup)

// DELETE group
router.delete('/:id', protect, authorizeRoles('admin'), deleteGroup)

module.exports = router
