const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/authMiddleware.js')
const adminController = require('../controllers/authController.js')

// Admin only routes
router.use(authMiddleware(['admin']))

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get('/users', adminController.getAllUsers)

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin]
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
 *               - phone
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, teacher, student, parent]
 *               parentId:
 *                 type: string
 *                 description: "For students only - parent ID"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post('/users', adminController.createUser)

/**
 * @swagger
 * /api/admin/link-parent-student:
 *   post:
 *     summary: Link parent and student
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parentId
 *               - studentId
 *             properties:
 *               parentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               studentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Parent and student linked successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Parent or student not found
 */
router.post('/link-parent-student', adminController.linkParentStudent)

/**
 * @swagger
 * /api/admin/parent/{parentId}/children:
 *   get:
 *     summary: Get parent's children
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent user ID
 *     responses:
 *       200:
 *         description: List of parent's children
 *       404:
 *         description: Parent not found
 */
router.get('/parent/:parentId/children', adminController.getParentChildren)

module.exports = router
