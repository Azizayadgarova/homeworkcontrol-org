const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Format phone number
const formatPhone = phone => {
	if (!phone) return null
	let cleaned = phone.toString().replace(/\D/g, '')
	if (cleaned.length === 9) cleaned = '998' + cleaned
	return cleaned
}

// REGISTER
exports.register = async (req, res) => {
	try {
		let { name, phone, password, role } = req.body

		console.log('📝 Register request:', { name, phone, role })

		// Validation
		if (!name || !phone || !password || !role) {
			return res.status(400).json({
				success: false,
				message: "Barcha maydonlarni to'ldiring",
			})
		}

		// Format phone
		phone = formatPhone(phone)
		if (!phone || phone.length !== 12) {
			return res.status(400).json({
				success: false,
				message: "Telefon raqami noto'g'ri (12 raqam bo'lishi kerak)",
			})
		}

		// Check if user exists
		const existing = await User.findOne({ phone })
		if (existing) {
			return res.status(409).json({
				success: false,
				message: 'Bu telefon raqam bilan foydalanuvchi mavjud',
			})
		}

		// Create user (password avtomatik hash qilinadi modelda)
		const user = await User.create({
			name: name.trim(),
			phone,
			password, // Modelda avtomatik hash qilinadi
			role: role.toLowerCase(),
		})

		// Generate token
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.SECRET_KEY,
			{ expiresIn: '30d' }
		)

		// Remove password from response
		const userResponse = user.toObject()
		delete userResponse.password

		res.status(201).json({
			success: true,
			message: "Ro'yxatdan o'tdingiz",
			token,
			user: userResponse,
		})
	} catch (error) {
		console.error('❌ Register error:', error)

		if (error.code === 11000) {
			return res.status(409).json({
				success: false,
				message: 'Bu telefon raqam allaqachon mavjud',
			})
		}

		if (error.name === 'ValidationError') {
			return res.status(400).json({
				success: false,
				message: "Ma'lumotlar noto'g'ri",
				errors: Object.values(error.errors).map(e => e.message),
			})
		}

		res.status(500).json({
			success: false,
			message: 'Server xatosi',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		})
	}
}

// LOGIN
exports.login = async (req, res) => {
	try {
		let { phone, password } = req.body

		console.log('🔐 Login request for phone:', phone)

		// Validation
		if (!phone || !password) {
			return res.status(400).json({
				success: false,
				message: 'Telefon raqam va parol kiritish majburiy',
			})
		}

		// Format phone
		phone = formatPhone(phone)

		// Find user
		const user = await User.findOne({ phone })
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Foydalanuvchi topilmadi',
			})
		}

		// Check password
		const bcrypt = require('bcrypt')
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Noto'g'ri parol",
			})
		}

		// Generate token
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.SECRET_KEY,
			{ expiresIn: '30d' }
		)

		// Remove password from response
		const userResponse = user.toObject()
		delete userResponse.password

		res.json({
			success: true,
			message: 'Kirish muvaffaqiyatli',
			token,
			user: userResponse,
		})
	} catch (error) {
		console.error('❌ Login error:', error)
		res.status(500).json({
			success: false,
			message: 'Server xatosi',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		})
	}
}

// GET PROFILE
exports.getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password')

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Foydalanuvchi topilmadi',
			})
		}

		res.json({
			success: true,
			user,
		})
	} catch (error) {
		console.error('Profile error:', error)
		res.status(500).json({
			success: false,
			message: 'Server xatosi',
		})
	}
}
