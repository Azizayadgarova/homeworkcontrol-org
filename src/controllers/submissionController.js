const Submission = require('../models/Submission')
const Task = require('../models/Task')

// Student vazifa topshiradi
const createSubmission = async (req, res) => {
	try {
		const { taskId, link } = req.body
		const task = await Task.findById(taskId)
		if (!task) return res.status(404).json({ message: 'Task not found' })

		// ✅ Deadline tekshiruvi
		if (task.deadline && new Date() > task.deadline) {
			return res.status(400).json({ message: 'Submission deadline passed' })
		}

		const submission = await Submission.create({
			task: taskId,
			student: req.user._id,
			link,
			status: 'submitted',
		})

		task.submissions.push(submission._id)
		await task.save()

		res.status(201).json(submission)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error', error: err.message })
	}
}

// Submissionsni olish
const getSubmissions = async (req, res) => {
	try {
		const { taskId, studentId } = req.query
		const filter = {}
		if (taskId) filter.task = taskId
		if (studentId) filter.student = studentId

		const submissions = await Submission.find(filter)
			.populate('student', 'name phone')
			.populate('task', 'title deadline')

		res.json(submissions)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error', error: err.message })
	}
}

// Teacher ball qo‘yadi va status o‘zgartiradi
const updateSubmission = async (req, res) => {
	try {
		const submission = await Submission.findById(req.params.id)
		if (!submission)
			return res.status(404).json({ message: 'Submission not found' })

		const { status, score, comment } = req.body
		if (status) submission.status = status
		if (score || score === 0) submission.score = score
		if (comment) submission.comment = comment

		await submission.save()
		res.json(submission)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error', error: err.message })
	}
}

module.exports = { createSubmission, getSubmissions, updateSubmission }
