const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ['admin', 'teacher', 'student', 'parent'],
			default: 'student',
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		children: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
	},
	{
		timestamps: true,
	}
)

// Phone number formatter - yangi usul
userSchema.pre('save', async function () {
	if (this.phone && this.isModified('phone')) {
		// Remove all non-digit characters
		let phone = this.phone.replace(/\D/g, '')

		// Ensure it starts with 998
		if (phone.length === 9) {
			phone = '998' + phone
		}

		this.phone = phone
	}

	// Agar parol o'zgartirilsa, hash qilish
	if (this.isModified('password')) {
		const bcrypt = require('bcrypt')
		this.password = await bcrypt.hash(this.password, 10)
	}
})

// FindOneAndUpdate uchun telefon formatter
userSchema.pre('findOneAndUpdate', async function () {
	const update = this.getUpdate()

	if (update.$set && update.$set.phone) {
		let phone = update.$set.phone.replace(/\D/g, '')
		if (phone.length === 9) {
			phone = '998' + phone
		}
		update.$set.phone = phone
	}
})

module.exports = mongoose.model('User', userSchema)
