const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: String,
		link: String,
		deadline: Date,
		group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
		student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		status: {
			type: String,
			enum: ['not_submitted', 'submitted', 'rework', 'checked'],
			default: 'not_submitted',
		},
		score: { type: Number, default: 0 },
		comment: String,
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Task', taskSchema)
