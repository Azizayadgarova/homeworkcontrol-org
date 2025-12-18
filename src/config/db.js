const mongoose = require('mongoose')

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI) // opts olib tashlandi
		console.log('✅ MongoDB connected successfully!')
	} catch (err) {
		console.error('❌ MongoDB connection error:', err)
		process.exit(1)
	}
}

module.exports = connectDB
