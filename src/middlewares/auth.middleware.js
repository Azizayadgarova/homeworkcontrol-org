const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY || 'secret123'

exports.authMiddleware = (roles = []) => {
	return (req, res, next) => {
		const token = req.headers['authorization']?.split(' ')[1]
		if (!token) return res.status(401).json({ message: 'No token provided' })

		try {
			const decoded = jwt.verify(token, SECRET_KEY)
			if (roles.length && !roles.includes(decoded.role)) {
				return res.status(403).json({ message: 'Forbidden' })
			}
			req.user = decoded
			next()
		} catch (err) {
			res.status(401).json({ message: 'Invalid token' })
		}
	}
}
