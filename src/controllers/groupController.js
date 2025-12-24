const Group = require('../models/Group')
const User = require('../models/User')

// CREATE group (ADMIN)
const createGroup = async (req, res) => {
	try {
		const { name, schedule = [], teacherId, level } = req.body

		if (!name || !level) {
			return res.status(400).json({ message: 'Name and level required' })
		}

		const group = await Group.create({
			name,
			level,
			schedule,
			teacher: teacherId || null,
			students: [],
		})

		res.status(201).json(group)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

const getGroups = async (req, res) => {
	try {
		let groups
		if (req.user.role === 'teacher') {
			groups = await Group.find({ teacher: req.user._id })
				.populate('students', 'name phone')
				.populate('teacher', 'name phone')
		} else {
			groups = await Group.find()
				.populate('students', 'name phone')
				.populate('teacher', 'name phone')
		}
		res.json(groups)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// UPDATE group (ADMIN)
const updateGroup = async (req, res) => {
	try {
		const { name, schedule, teacherId, level } = req.body
		const group = await Group.findById(req.params.id)
		if (!group) return res.status(404).json({ message: 'Group not found' })

		if (name) group.name = name
		if (Array.isArray(schedule) && schedule.length > 0)
			group.schedule = schedule
		if (teacherId) group.teacher = teacherId
		if (level) group.level = level

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
		if (!group) return res.status(404).json({ message: 'Group not found' })

		await group.deleteOne()
		res.json({ message: 'Group removed' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// ADD STUDENT TO GROUP
const addStudentToGroup = async (req, res) => {
	try {
		const { groupId, studentId } = req.body

		const group = await Group.findById(groupId)
		if (!group) return res.status(404).json({ message: 'Group not found' })

		const student = await User.findById(studentId)
		if (!student || student.role !== 'student')
			return res.status(404).json({ message: 'Student not found' })

		if (group.students.includes(studentId))
			return res.status(400).json({ message: 'Student already in group' })

		group.students.push(studentId)
		student.group = groupId

		await group.save()
		await student.save()

		res.json({ message: 'Student added to group successfully', group })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// REMOVE STUDENT FROM GROUP
const removeStudentFromGroup = async (req, res) => {
	try {
		const { groupId, studentId } = req.body

		const group = await Group.findById(groupId)
		if (!group) return res.status(404).json({ message: 'Group not found' })

		const student = await User.findById(studentId)
		if (!student || student.role !== 'student')
			return res.status(404).json({ message: 'Student not found' })

		// Guruhdan o‘quvchini olib tashlash
		group.students = group.students.filter(id => id.toString() !== studentId)
		student.group = undefined // student.group maydonini tozalash

		await group.save()
		await student.save()

		res.json({ message: 'Student removed from group', group })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// GET group by ID
const getGroupById = async (req, res) => {
	try {
		const group = await Group.findById(req.params.id)
			.populate('students', 'name phone')
			.populate('teacher', 'name phone')

		if (!group) return res.status(404).json({ message: 'Group not found' })

		res.json(group)
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
	removeStudentFromGroup, // yangi qo‘shildi
	getGroupById,
}
