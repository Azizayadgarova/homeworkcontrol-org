const Task = require('../models/Task')

// Task yaratish (teacher/admin)
const createTask = async (req, res) => {
	try {
		const { title, description, lessonNumber, deadline, groupId } = req.body

		const task = await Task.create({
			title,
			description,
			lessonNumber,
			deadline: deadline ? new Date(deadline) : null,
			group: groupId,
		})

		res.status(201).json(task)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error', error: err.message })
	}
}

// Guruh vazifalarini olish
const getTasks = async (req, res) => {
	try {
		const { groupId } = req.query
		const tasks = await Task.find({ group: groupId }).populate({
			path: 'submissions',
			populate: { path: 'student', select: 'name phone' },
		})
		res.json(tasks)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error', error: err.message })
	}
}

// Taskni o‘zgartirish
const updateTask = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id)
		if (!task) return res.status(404).json({ message: 'Task not found' })

		const { title, description, lessonNumber, deadline } = req.body
		if (title) task.title = title
		if (description) task.description = description
		if (lessonNumber) task.lessonNumber = lessonNumber
		if (deadline) task.deadline = new Date(deadline)

		await task.save()
		res.json(task)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error', error: err.message })
	}
}

// Taskni o‘chirish
const deleteTask = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id)
		if (!task) return res.status(404).json({ message: 'Task not found' })

		await task.remove()
		res.json({ message: 'Task removed' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error', error: err.message })
	}
}

module.exports = { createTask, getTasks, updateTask, deleteTask }
