const Task = require('../models/Task')
const Group = require('../models/Group')

// CREATE task (admin/teacher)
const createTask = async (req, res) => {
	const { title, description, lessonNumber, deadline, groupId } = req.body
	const group = await Group.findById(groupId)
	if (!group) return res.status(404).json({ message: 'Group not found' })
	if (
		req.user.role === 'teacher' &&
		group.teacher.toString() !== req.user._id.toString()
	)
		return res.status(403).json({ message: 'Not authorized for this group' })

	const task = await Task.create({
		title,
		description,
		lessonNumber,
		deadline,
		group: groupId,
		teacher: req.user._id,
	})
	res.status(201).json(task)
}

// GET tasks by group
const getTasks = async (req, res) => {
	const { groupId } = req.query
	const tasks = await Task.find({ group: groupId }).populate('submissions')
	res.json(tasks)
}

// UPDATE task
const updateTask = async (req, res) => {
	const task = await Task.findById(req.params.id)
	if (!task) return res.status(404).json({ message: 'Task not found' })
	if (
		req.user.role === 'teacher' &&
		task.teacher.toString() !== req.user._id.toString()
	)
		return res.status(403).json({ message: 'Not authorized for this task' })

	Object.assign(task, req.body)
	await task.save()
	res.json(task)
}

// DELETE task
const deleteTask = async (req, res) => {
	const task = await Task.findById(req.params.id)
	if (!task) return res.status(404).json({ message: 'Task not found' })
	if (
		req.user.role === 'teacher' &&
		task.teacher.toString() !== req.user._id.toString()
	)
		return res.status(403).json({ message: 'Not authorized for this task' })

	await task.remove()
	res.json({ message: 'Task removed' })
}

module.exports = { createTask, getTasks, updateTask, deleteTask }
