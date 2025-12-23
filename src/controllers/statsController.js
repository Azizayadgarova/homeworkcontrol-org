const User = require('../models/User')
const Task = require('../models/Task')
const Submission = require('../models/Submission')

const getStats = async (req, res) => {
	try {
		const users = await User.countDocuments()
		const students = await User.countDocuments({ role: 'student' })
		const teachers = await User.countDocuments({ role: 'teacher' })
		const parents = await User.countDocuments({ role: 'parent' })
		const tasks = await Task.countDocuments()
		const submissions = await Submission.countDocuments()

		res.json({
			users,
			students,
			teachers,
			parents,
			tasks,
			submissions,
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

module.exports = { getStats } // 🔴 MUHIM
