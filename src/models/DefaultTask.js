const mongoose = require('mongoose')
const LEVELS = require('../constants/levels')

const defaultTaskSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: String,

		level: {
			type: String,
			enum: Object.values(LEVELS),
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('DefaultTask', defaultTaskSchema)
