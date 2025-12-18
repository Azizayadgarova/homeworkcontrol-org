const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	phone: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: {
		type: String,
		enum: ['admin', 'teacher', 'student', 'parent'],
		required: true,
	},
})

module.exports = mongoose.model('User', userSchema)
