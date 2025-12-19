// src/server.js (to'liq yangi versiya)
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const { swaggerDocs } = require('./config/swagger')

const app = express()

// Middleware
app.use(express.json())

// Database
mongoose
	.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/homeworkcontrol')
	.then(() => console.log('✅ MongoDB connected'))
	.catch(err => console.log('❌ MongoDB error:', err.message))

// Routes
app.get('/', (req, res) => {
	res.json({
		message: 'Homework Control API',
		version: '1.0.0',
		docs: '/api-docs',
		auth: '/api/auth',
		admin: '/api/admin',
	})
})

// Load routes
try {
	app.use('/api/auth', require('./routes/auth.routes'))
	console.log('✅ Auth routes loaded')
} catch (err) {
	console.error('Auth routes error:', err.message)
}

try {
	app.use('/api/admin', require('./routes/admin.routes'))
	console.log('✅ Admin routes loaded')
} catch (err) {
	console.error('Admin routes error:', err.message)
}

// Start server with port 5001
const PORT = 5001 // 👈 HARDOCODE QILDIK

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`)
	console.log(`🌐 http://localhost:${PORT}`)

	// Swagger docs
	try {
		const { swaggerDocs } = require('./config/swagger')
		swaggerDocs(app, PORT)
	} catch (err) {
		console.log('Swagger not loaded:', err.message)
	}
})
