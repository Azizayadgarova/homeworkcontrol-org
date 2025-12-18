const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY || 'secret123'

exports.registerAdmin = async (req, res) => {
	try {
		const existingAdmin = await User.findOne({ role: 'admin' })
		if (existingAdmin)
			return res.status(400).json({ message: 'Admin already exists' })

		const { name, phone, password } = req.body
		const hashedPassword = await bcrypt.hash(password, 10)

		const admin = new User({
			name,
			phone,
			password: hashedPassword,
			role: 'admin',
		})
		await admin.save()

		res.status(201).json({ message: 'Admin registered successfully' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.login = async (req, res) => {
	try {
		const { phone, password } = req.body
		const user = await User.findOne({ phone })
		if (!user) return res.status(400).json({ message: 'User not found' })

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) return res.status(400).json({ message: 'Incorrect password' })

		const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
			expiresIn: '1d',
		})
		res.json({ token, role: user.role })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
