const Group = require('../models/Group')
const User = require('../models/User')

// CREATE group
const createGroup = async (req, res) => {
	const { name, schedule, teacherId } = req.body
	const teacher = await User.findById(teacherId)
	if (!teacher || teacher.role !== 'teacher')
		return res.status(400).json({ message: 'Invalid teacher ID' })

	const group = await Group.create({ name, schedule, teacher: teacherId })
	res.status(201).json(group)
}

// GET groups (teacher sees own groups)
const getGroups = async (req, res) => {
	if (req.user.role === 'teacher') {
		const groups = await Group.find({ teacher: req.user._id }).populate(
			'students',
			'name phone'
		)
		res.json(groups)
	} else {
		const groups = await Group.find()
			.populate('students', 'name phone')
			.populate('teacher', 'name phone')
		res.json(groups)
	}
}

// UPDATE group
const updateGroup = async (req, res) => {
	const { name, schedule, teacherId } = req.body
	const group = await Group.findById(req.params.id)
	if (!group) return res.status(404).json({ message: 'Group not found' })
	if (name) group.name = name
	if (schedule) group.schedule = schedule
	if (teacherId) group.teacher = teacherId
	await group.save()
	res.json(group)
}

// DELETE group
const deleteGroup = async (req, res) => {
	const group = await Group.findById(req.params.id)
	if (!group) return res.status(404).json({ message: 'Group not found' })
	await group.remove()
	res.json({ message: 'Group removed' })
}

module.exports = { createGroup, getGroups, updateGroup, deleteGroup }
