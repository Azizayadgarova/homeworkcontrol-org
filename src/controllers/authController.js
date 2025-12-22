const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Token generator
const generateToken = id =>
	jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

// REGISTER
const register = async (req, res) => {
	try {
		const { name, phone, password, role, group, child } = req.body
		const exists = await User.findOne({ phone })
		if (exists)
			return res.status(400).json({ message: 'Phone already registered' })

		const user = await User.create({
			name,
			phone,
			password,
			role,
			group,
			child,
		})
		res
			.status(201)
			.json({
				_id: user._id,
				name: user.name,
				phone: user.phone,
				role: user.role,
				token: generateToken(user._id),
			})
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message })
	}
}

// LOGIN
const login = async (req, res) => {
	try {
		const { phone, password } = req.body
		const user = await User.findOne({ phone })
		if (user && (await user.matchPassword(password))) {
			res.json({
				_id: user._id,
				name: user.name,
				phone: user.phone,
				role: user.role,
				token: generateToken(user._id),
			})
		} else {
			res.status(401).json({ message: 'Phone or password incorrect' })
		}
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message })
	}
}

// LINK parent-student
const linkParentStudent = async (req, res) => {
	try {
		const { parentId, studentId } = req.body
		const parent = await User.findById(parentId)
		const student = await User.findById(studentId)
		if (!parent || parent.role !== 'parent')
			return res.status(404).json({ message: 'Parent not found' })
		if (!student || student.role !== 'student')
			return res.status(404).json({ message: 'Student not found' })

		student.child = parent._id
		await student.save()
		res.json({ message: 'Parent and student linked' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// Get parent's children
const getParentChildren = async (req, res) => {
	try {
		const parent = await User.findById(req.params.parentId)
		if (!parent || parent.role !== 'parent')
			return res.status(404).json({ message: 'Parent not found' })

		const children = await User.find({ child: parent._id }).select('-password')
		res.json(children)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

module.exports = { register, login, linkParentStudent, getParentChildren }
