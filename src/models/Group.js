const mongoose = require('mongoose')

// Har bir dars uchun schema
const lessonSchema = new mongoose.Schema({
	day: {
		type: String,
		required: true,
		enum: [
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday',
		],
	},
	startTime: { type: String, required: true }, // masalan: "08:00"
	endTime: { type: String, required: true }, // masalan: "09:30"
})

const groupSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },

		// Yangi: schedule array
		schedule: [lessonSchema],

		students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

		teacher: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		level: {
			type: String,
			required: true,
			enum: [
				'Beginner',
				'Elementary',
				'Intermediate',
				'Advanced',
				'Professional',
			],
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Group', groupSchema)
