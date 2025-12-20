const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  days: [String],
  time: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

module.exports = mongoose.model('Group', groupSchema)