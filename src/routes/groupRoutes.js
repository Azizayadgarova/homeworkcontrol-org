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

router
	.route('/')
	.get(protect, getGroups)
	.post(protect, authorizeRoles('admin'), createGroup)

router
	.route('/:id')
	.patch(protect, authorizeRoles('admin'), updateGroup)
	.delete(protect, authorizeRoles('admin'), deleteGroup)

module.exports = router
