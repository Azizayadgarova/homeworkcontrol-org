// auth.middleware.js
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const SECRET_KEY = process.env.SECRET_KEY || 'your-super-secret-key-2024'

// Asosiy auth middleware
const authMiddleware = (roles = []) => {
	return async (req, res, next) => {
		try {
			const authHeader = req.headers.authorization

			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return res.status(401).json({
					success: false,
					message: 'No token provided',
				})
			}

			const token = authHeader.split(' ')[1]

			// Verify token
			const decoded = jwt.verify(token, SECRET_KEY)

			// Check if user still exists and is active
			const user = await User.findById(decoded.id).select('-password')
			if (!user || user.status !== 'active') {
				return res.status(401).json({
					success: false,
					message: 'User not found or inactive',
				})
			}

			// Check role permissions
			if (roles.length > 0 && !roles.includes(user.role)) {
				return res.status(403).json({
					success: false,
					message: 'Access denied',
				})
			}

			// Add user to request
			req.user = user
			next()
		} catch (error) {
			if (error.name === 'JsonWebTokenError') {
				return res.status(401).json({
					success: false,
					message: 'Invalid token',
				})
			}
			if (error.name === 'TokenExpiredError') {
				return res.status(401).json({
					success: false,
					message: 'Token expired',
				})
			}
			console.error('Auth middleware error:', error)
			res.status(500).json({
				success: false,
				message: 'Server error',
			})
		}
	}
}

// Faqat role tekshirish uchun middleware
const roleMiddleware = role => {
	return (req, res, next) => {
		if (req.user && req.user.role !== role) {
			return res.status(403).json({
				success: false,
				message: 'Access denied',
			})
		}
		next()
	}
}

module.exports = {
	authMiddleware,
	roleMiddleware,
}
