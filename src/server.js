require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')

const app = express()
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/admin', require('./routes/admin.routes'))

// MongoDB va server
const startServer = async () => {
	try {
		await connectDB()
		const PORT = process.env.PORT || 5000
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
	} catch (err) {
		console.error('Failed to connect to MongoDB:', err)
		process.exit(1)
	}
}

startServer()
