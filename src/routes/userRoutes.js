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

/**
 * @swagger
 * /auth/create-admin:
 *   post:
 *     summary: Create first admin user
 *     tags: [Auth]
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
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created
 *       400:
 *         description: Admin already exists
 */
router.post('/create-admin', async (req, res) => {
	const { name, phone, password } = req.body
	const User = require('../models/User')
	const exists = await User.findOne({ phone })
	if (exists) return res.status(400).json({ message: 'Admin already exists' })
	const user = await User.create({ name, phone, password, role: 'admin' })
	res.status(201).json({ message: 'Admin created', user })
})

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (admin only)
 *     tags: [Auth]
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
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/register', protect, authorizeRoles('admin'), register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 */
router.post('/login', login)

/**
 * @swagger
 * /auth/link-parent-student:
 *   post:
 *     summary: Link parent and student
 *     tags: [Auth]
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
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parent and student linked
 */
router.post(
	'/link-parent-student',
	protect,
	authorizeRoles('admin'),
	linkParentStudent
)

/**
 * @swagger
 * /auth/parent/{parentId}/children:
 *   get:
 *     summary: Get parent's children
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of children
 */
router.get(
	'/parent/:parentId/children',
	protect,
	authorizeRoles('parent'),
	getParentChildren
)

module.exports = router
