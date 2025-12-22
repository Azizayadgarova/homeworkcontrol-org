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

router
	.route('/')
	.get(protect, getTasks)
	.post(protect, authorizeRoles('admin', 'teacher'), createTask)

router
	.route('/:id')
	.patch(protect, authorizeRoles('admin', 'teacher'), updateTask)
	.delete(protect, authorizeRoles('admin', 'teacher'), deleteTask)

module.exports = router
