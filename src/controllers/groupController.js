const Group = require('../models/Group')
const User = require('../models/User')

// CREATE group (ADMIN)
const createGroup = async (req, res) => {
	try {
		const { name, schedule, teacherId } = req.body

		const teacher = await User.findById(teacherId)
		if (!teacher || teacher.role !== 'teacher') {
			return res.status(400).json({ message: 'Invalid teacher ID' })
		}

		const group = await Group.create({
			name,
			schedule,
			teacher: teacherId,
		})

		res.status(201).json(group)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// GET groups
const getGroups = async (req, res) => {
	try {
		if (req.user.role === 'teacher') {
			const groups = await Group.find({ teacher: req.user._id })
				.populate('students', 'name phone')
				.populate('teacher', 'name phone')
			return res.json(groups)
		}

		const groups = await Group.find()
			.populate('students', 'name phone')
			.populate('teacher', 'name phone')

		res.json(groups)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// UPDATE group (ADMIN)
const updateGroup = async (req, res) => {
	try {
		const { name, schedule, teacherId } = req.body
		const group = await Group.findById(req.params.id)

		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}

		if (name) group.name = name
		if (schedule) group.schedule = schedule
		if (teacherId) group.teacher = teacherId

		await group.save()
		res.json(group)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// DELETE group (ADMIN)
const deleteGroup = async (req, res) => {
	try {
		const group = await Group.findById(req.params.id)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}

		await group.deleteOne()
		res.json({ message: 'Group removed' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// ✅ ADD STUDENT TO GROUP (ADMIN / TEACHER)
const addStudentToGroup = async (req, res) => {
	try {
		const { groupId, studentId } = req.body

		const group = await Group.findById(groupId)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}

		const student = await User.findById(studentId)
		if (!student || student.role !== 'student') {
			return res.status(404).json({ message: 'Student not found' })
		}

		if (group.students.includes(studentId)) {
			return res.status(400).json({ message: 'Student already in group' })
		}

		group.students.push(studentId)
		student.group = groupId

		await group.save()
		await student.save()

		res.json({
			message: 'Student added to group successfully',
			group,
		})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

module.exports = {
	createGroup,
	getGroups,
	updateGroup,
	deleteGroup,
	addStudentToGroup,
}
