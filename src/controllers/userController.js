const User = require('../models/User')

// GET users by role
const getUsersByRole = async (req, res) => {
	try {
		const { role } = req.query
		if (!role) return res.status(400).json({ message: 'Role is required' })

		const users = await User.find({ role }).select('_id name phone role')
		res.json(users)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// CREATE user
// CREATE user
const createUser = async (req, res) => {
	try {
		const { name, phone, password, role, childId } = req.body // childId ota-ona uchun
		const exists = await User.findOne({ phone })
		if (exists) return res.status(400).json({ message: 'User already exists' })

		const userData = { name, phone, password, role }

		// agar parent bo'lsa, child maydonini to'ldirish
		if (role === 'parent' && childId) {
			const child = await User.findById(childId)
			if (!child || child.role !== 'student') {
				return res.status(400).json({ message: 'Student not found for parent' })
			}
			userData.child = childId
		}

		const user = await User.create(userData)
		res.status(201).json(user)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// UPDATE user
const updateUser = async (req, res) => {
	try {
		const { id } = req.params
		const { name, phone, role } = req.body
		const user = await User.findByIdAndUpdate(
			id,
			{ name, phone, role },
			{ new: true }
		)
		if (!user) return res.status(404).json({ message: 'User not found' })
		res.json(user)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// DELETE user
const deleteUser = async (req, res) => {
	try {
		const { id } = req.params
		const user = await User.findByIdAndDelete(id)
		if (!user) return res.status(404).json({ message: 'User not found' })
		res.json({ message: 'User deleted successfully' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

module.exports = {
	getUsersByRole,
	createUser,
	updateUser,
	deleteUser,
}
