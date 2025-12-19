const Task = require('../models/Task')

exports.getAllTasks = async (req, res) => {
	try {
		const tasks = await Task.find()
			.populate('student', 'name phone')
			.populate('group', 'name')

		res.json(tasks)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.createTask = async (req, res) => {
	try {
		const task = new Task(req.body)
		await task.save()

		const populatedTask = await Task.findById(task._id)
			.populate('student', 'name phone')
			.populate('group', 'name')

		res.status(201).json(populatedTask)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.updateTask = async (req, res) => {
	try {
		const { id } = req.params
		const task = await Task.findByIdAndUpdate(id, req.body, {
			new: true,
		})
			.populate('student', 'name phone')
			.populate('group', 'name')

		if (!task) {
			return res.status(404).json({ message: 'Task not found' })
		}

		res.json(task)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.deleteTask = async (req, res) => {
	try {
		const { id } = req.params
		const task = await Task.findByIdAndDelete(id)

		if (!task) {
			return res.status(404).json({ message: 'Task not found' })
		}

		res.json({ message: 'Task deleted successfully' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
