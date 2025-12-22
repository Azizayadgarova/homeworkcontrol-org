require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const groupRoutes = require('./routes/groupRoutes')
const taskRoutes = require('./routes/taskRoutes')
const submissionRoutes = require('./routes/submissionRoutes')
const { swaggerDocs } = require('./config/swagger')
const app = express()
connectDB()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/submissions', submissionRoutes)
swaggerDocs(app)
// 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
