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
 * /api/tasks:
 *   get:
 *     summary: Get all tasks (all roles)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create task (admin/teacher)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 */
router
	.route('/')
	.get(protect, getTasks)
	.post(protect, authorizeRoles('admin', 'teacher'), createTask)

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update task (admin/teacher)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete task (admin/teacher)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 */
router
	.route('/:id')
	.patch(protect, authorizeRoles('admin', 'teacher'), updateTask)
	.delete(protect, authorizeRoles('admin', 'teacher'), deleteTask)

module.exports = router
