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

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups (teacher/admin)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create new group (admin only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 */
router
	.route('/')
	.get(protect, getGroups)
	.post(protect, authorizeRoles('admin'), createGroup)

/**
 * @swagger
 * /api/groups/{id}:
 *   patch:
 *     summary: Update group (admin only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete group (admin only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 */
router
	.route('/:id')
	.patch(protect, authorizeRoles('admin'), updateGroup)
	.delete(protect, authorizeRoles('admin'), deleteGroup)

module.exports = router
