const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: String,

		group: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
			required: true,
		},

		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},

		isDefault: {
			type: Boolean,
			default: false,
		},

		assignType: {
			type: String,
			enum: ['all', 'self'],
			default: 'all',
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Task', taskSchema)
