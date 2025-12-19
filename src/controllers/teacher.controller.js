const Task = require('../models/Task')
const Group = require('../models/Group')

// Guruhlar ro'yxatini olish
exports.getGroups = async (req, res) => {
	try {
		const groups = await Group.find({ teacher: req.user.id }).populate(
			'students'
		)
		res.json(groups)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// Guruhdagi o'quvchilar va vazifalar
exports.getGroupTasks = async (req, res) => {
	try {
		const { groupId } = req.params
		const tasks = await Task.find({ group: groupId }).populate('student')
		res.json(tasks)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// Ball va comment qo'yish
exports.gradeTask = async (req, res) => {
	try {
		const { taskId } = req.params
		const { score, status, comment } = req.body
		const task = await Task.findByIdAndUpdate(
			taskId,
			{ score, status, comment },
			{ new: true }
		)
		res.json(task)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
