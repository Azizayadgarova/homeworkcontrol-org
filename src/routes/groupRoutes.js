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
 * /groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 */
router.get('/', protect, getGroups)

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Create a group (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created
 */
router.post('/', protect, authorizeRoles('admin'), createGroup)

/**
 * @swagger
 * /groups/{id}:
 *   patch:
 *     summary: Update group by ID (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group updated
 */
router.patch('/:id', protect, authorizeRoles('admin'), updateGroup)

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Delete group by ID (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted
 */
router.delete('/:id', protect, authorizeRoles('admin'), deleteGroup)

module.exports = router
