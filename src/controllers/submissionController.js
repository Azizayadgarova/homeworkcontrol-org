const Submission = require('../models/Submission')

// CREATE submission (student)
const createSubmission = async (req, res) => {
	const { taskId, link } = req.body
	const submission = await Submission.create({
		task: taskId,
		student: req.user._id,
		link,
		status: 'submitted',
	})
	res.status(201).json(submission)
}

// GET submissions (optional filters)
const getSubmissions = async (req, res) => {
	const { taskId, studentId } = req.query
	const filter = {}
	if (taskId) filter.task = taskId
	if (studentId) filter.student = studentId

	const submissions = await Submission.find(filter)
		.populate('student', 'name phone')
		.populate('task', 'title')
	res.json(submissions)
}

// UPDATE submission (teacher)
const updateSubmission = async (req, res) => {
	const submission = await Submission.findById(req.params.id)
	if (!submission)
		return res.status(404).json({ message: 'Submission not found' })

	Object.assign(submission, req.body)
	await submission.save()
	res.json(submission)
}

module.exports = { createSubmission, getSubmissions, updateSubmission }
