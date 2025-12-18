const User = require('../models/User')
const bcrypt = require('bcrypt')

exports.createUser = async (req, res) => {
	try {
		const { name, phone, password, role } = req.body
		const existingUser = await User.findOne({ phone })
		if (existingUser)
			return res.status(400).json({ message: 'User already exists' })

		const hashedPassword = await bcrypt.hash(password, 10)
		const user = new User({ name, phone, password: hashedPassword, role })
		await user.save()

		res.status(201).json({ message: 'User created successfully', user })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.updateUser = async (req, res) => {
	try {
		const { id } = req.params
		const { name, phone, password, role } = req.body

		const updateData = { name, phone, role }
		if (password) updateData.password = await bcrypt.hash(password, 10)

		const user = await User.findByIdAndUpdate(id, updateData, { new: true })
		if (!user) return res.status(404).json({ message: 'User not found' })

		res.json({ message: 'User updated', user })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params
		const user = await User.findByIdAndDelete(id)
		if (!user) return res.status(404).json({ message: 'User not found' })

		res.json({ message: 'User deleted' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
