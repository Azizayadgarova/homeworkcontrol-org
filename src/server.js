require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { swaggerDocs } = require('./config/swagger')

const app = express()

// 🔥 CORS — ENG MUHIM QATOR
app.use(
	cors({
		origin: [
			'http://localhost:5173',
			'http://localhost:3000',
			'https://YOUR-FRONTEND.vercel.app',
		],
		credentials: true,
	})
)

app.use(express.json())

// Database
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log('✅ MongoDB connected'))
	.catch(err => console.log('❌ MongoDB error:', err.message))

// Routes
app.get('/', (req, res) => {
	res.json({
		message: 'Homework Control API',
		version: '1.0.0',
	})
})

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/admin', require('./routes/admin.routes'))
app.use('/api/parent', require('./routes/parent.routes'))
app.use('/api/student', require('./routes/student.routes'))
app.use('/api/teacher', require('./routes/teacher.routes'))
app.use('/api/tasks', require('./routes/task.routes'))

// ❗ PORT ENV dan olinadi
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`)
	swaggerDocs(app, PORT)
})
