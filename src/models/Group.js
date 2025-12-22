const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
	name: { type: String, required: true },
	schedule: { type: String },
	students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
})

module.exports = mongoose.model('Group', groupSchema)
