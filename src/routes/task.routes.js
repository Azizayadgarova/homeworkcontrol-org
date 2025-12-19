const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth.middleware')
const {
	getAllTasks,
	createTask,
	updateTask,
	deleteTask,
} = require('../controllers/task.controller')

// Admin and teacher can manage tasks
router.get('/', authMiddleware(['admin', 'teacher']), getAllTasks)
router.post('/', authMiddleware(['admin', 'teacher']), createTask)
router.put('/:id', authMiddleware(['admin', 'teacher']), updateTask)
router.delete('/:id', authMiddleware(['admin', 'teacher']), deleteTask)

module.exports = router
