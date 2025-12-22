const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	lessonNumber: { type: Number },
	deadline: { type: Date },
	group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
	submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
})

module.exports = mongoose.model('Task', taskSchema)
