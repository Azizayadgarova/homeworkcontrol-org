const express = require('express')
const router = express.Router()

const {
	createTask,
	getTasks,
	updateTask,
	deleteTask,
	getStudentTasks,
	createCustomTask,
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
 */
router.post('/', protect, authorizeRoles('admin', 'teacher'), createTask)

/**
 * Update task
 */
router.patch('/:id', protect, authorizeRoles('admin', 'teacher'), updateTask)

/**
 * Delete task
 */
router.delete('/:id', protect, authorizeRoles('admin', 'teacher'), deleteTask)

/**
 * 🎓 STUDENT — levelga mos vazifalar (default + custom)
 */
router.get('/student', protect, authorizeRoles('student'), getStudentTasks)

/**
 * 👨‍🏫 TEACHER / ADMIN — custom task qo‘shish
 */
router.post(
	'/custom',
	protect,
	authorizeRoles('teacher', 'admin'),
	createCustomTask
)

module.exports = router
