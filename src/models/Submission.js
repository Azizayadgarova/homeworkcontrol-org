const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema(
	{
		task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		link: { type: String, required: true },
		status: {
			type: String,
			enum: ['not_submitted', 'submitted', 'revise', 'checked'],
			default: 'not_submitted',
		},
		score: { type: Number, default: 0 },
		comment: { type: String },
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Submission', submissionSchema)
