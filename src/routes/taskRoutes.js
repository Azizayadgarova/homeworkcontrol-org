const express = require('express')
const router = express.Router()
const {
	createTask,
	getTasks,
	updateTask,
	deleteTask,
} = require('../controllers/taskController')
const { protect } = require('../middlewares/authMiddleware')
const { authorizeRoles } = require('../middlewares/roleMiddleware')

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', protect, getTasks)

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task (admin or teacher)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - lessonNumber
 *               - deadline
 *               - groupId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               lessonNumber:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               groupId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
router.post('/', protect, authorizeRoles('admin', 'teacher'), createTask)

router.patch('/:id', protect, authorizeRoles('admin', 'teacher'), updateTask)
router.delete('/:id', protect, authorizeRoles('admin', 'teacher'), deleteTask)

module.exports = router
