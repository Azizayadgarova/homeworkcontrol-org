// src/controllers/admin.controller.js
const User = require('../models/User')
const bcrypt = require('bcrypt')

const adminController = {
	// CREATE USER
	createUser: async (req, res) => {
		try {
			const { name, phone, password, role, parentId } = req.body

			// Check if user exists
			const existingUser = await User.findOne({ phone })
			if (existingUser) {
				return res.status(400).json({
					success: false,
					message: 'User already exists',
				})
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 10)

			// Create user object
			const userData = {
				name: name.trim(),
				phone: phone.trim(),
				password: hashedPassword,
				role: role.toLowerCase(),
			}

			// If student and parentId provided, link them
			if (role === 'student' && parentId) {
				const parent = await User.findById(parentId)
				if (parent && parent.role === 'parent') {
					userData.parent = parentId
				}
			}

			// Create and save user
			const user = new User(userData)
			await user.save()

			// If student has parent, add to parent's children array
			if (role === 'student' && user.parent) {
				await User.findByIdAndUpdate(user.parent, {
					$addToSet: { children: user._id },
				})
			}

			// Populate parent info if exists
			const populatedUser = await User.findById(user._id)
				.populate('parent', 'name phone')
				.select('-password')

			res.status(201).json({
				success: true,
				message: 'User created successfully',
				user: populatedUser,
			})
		} catch (err) {
			console.error('Create user error:', err)
			res.status(500).json({
				success: false,
				message: 'Server error',
				error: err.message,
			})
		}
	},

	// GET ALL USERS
	getAllUsers: async (req, res) => {
		try {
			const users = await User.find()
				.populate('parent', 'name phone')
				.populate('children', 'name phone role')
				.select('-password')
				.lean()

			// Add virtual fields
			const usersWithVirtuals = users.map(user => ({
				...user,
				isParent: user.role === 'parent',
				isStudent: user.role === 'student',
				isTeacher: user.role === 'teacher',
				isAdmin: user.role === 'admin',
			}))

			res.json({
				success: true,
				count: users.length,
				users: usersWithVirtuals,
			})
		} catch (err) {
			console.error('Get all users error:', err)
			res.status(500).json({
				success: false,
				message: 'Server error',
				error: err.message,
			})
		}
	},

	// LINK PARENT AND STUDENT
	linkParentStudent: async (req, res) => {
		try {
			const { parentId, studentId } = req.body

			console.log('Linking request:', { parentId, studentId })

			// Validate ObjectId format
			if (!parentId || !studentId) {
				return res.status(400).json({
					success: false,
					message: 'parentId and studentId are required',
				})
			}

			// Find users
			const parent = await User.findById(parentId)
			const student = await User.findById(studentId)

			if (!parent || !student) {
				return res.status(404).json({
					success: false,
					message: 'Parent or student not found',
				})
			}

			// Check roles
			if (parent.role !== 'parent') {
				return res.status(400).json({
					success: false,
					message: 'User is not a parent',
				})
			}

			if (student.role !== 'student') {
				return res.status(400).json({
					success: false,
					message: 'User is not a student',
				})
			}

			// Remove from previous parent if exists
			if (student.parent && student.parent.toString() !== parentId) {
				await User.findByIdAndUpdate(student.parent, {
					$pull: { children: studentId },
				})
			}

			// Update student's parent
			student.parent = parentId
			await student.save()

			// Add to parent's children array
			await User.findByIdAndUpdate(parentId, {
				$addToSet: { children: studentId },
			})

			// Get updated data
			const updatedParent = await User.findById(parentId)
				.populate('children', 'name phone role')
				.select('-password')

			const updatedStudent = await User.findById(studentId)
				.populate('parent', 'name phone')
				.select('-password')

			res.json({
				success: true,
				message: 'Parent and student linked successfully',
				parent: {
					id: updatedParent._id,
					name: updatedParent.name,
					phone: updatedParent.phone,
					children: updatedParent.children,
				},
				student: {
					id: updatedStudent._id,
					name: updatedStudent.name,
					phone: updatedStudent.phone,
					parent: updatedStudent.parent,
				},
			})
		} catch (err) {
			console.error('Link parent-student error:', err)

			if (err.name === 'CastError') {
				return res.status(400).json({
					success: false,
					message: 'Invalid ID format',
				})
			}

			res.status(500).json({
				success: false,
				message: 'Server error',
				error: err.message,
			})
		}
	},

	// UPDATE USER
	updateUser: async (req, res) => {
		try {
			const { id } = req.params
			const { name, phone, password, role, parentId } = req.body

			// Find current user
			const currentUser = await User.findById(id)
			if (!currentUser) {
				return res.status(404).json({
					success: false,
					message: 'User not found',
				})
			}

			// Build update data
			const updateData = { name: name?.trim(), phone: phone?.trim(), role }

			// Update password if provided
			if (password) {
				updateData.password = await bcrypt.hash(password, 10)
			}

			// Handle parent linking for students
			if (role === 'student' && parentId) {
				const parent = await User.findById(parentId)
				if (parent && parent.role === 'parent') {
					updateData.parent = parentId

					// Remove from old parent's children
					if (
						currentUser.parent &&
						currentUser.parent.toString() !== parentId
					) {
						await User.findByIdAndUpdate(currentUser.parent, {
							$pull: { children: id },
						})
					}

					// Add to new parent's children
					await User.findByIdAndUpdate(parentId, {
						$addToSet: { children: id },
					})
				}
			} else if (role !== 'student') {
				// If changing from student to other role, remove parent link
				if (currentUser.parent) {
					updateData.parent = null
					await User.findByIdAndUpdate(currentUser.parent, {
						$pull: { children: id },
					})
				}
			}

			// Update user
			const user = await User.findByIdAndUpdate(id, updateData, {
				new: true,
				runValidators: true,
			})
				.populate('parent', 'name phone')
				.populate('children', 'name phone role')
				.select('-password')

			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'User not found after update',
				})
			}

			res.json({
				success: true,
				message: 'User updated successfully',
				user,
			})
		} catch (err) {
			console.error('Update user error:', err)

			if (err.name === 'ValidationError') {
				const messages = Object.values(err.errors).map(val => val.message)
				return res.status(400).json({
					success: false,
					message: 'Validation failed',
					errors: messages,
				})
			}

			if (err.code === 11000) {
				return res.status(409).json({
					success: false,
					message: 'Phone number already exists',
				})
			}

			res.status(500).json({
				success: false,
				message: 'Server error',
				error: err.message,
			})
		}
	},

	// DELETE USER
	deleteUser: async (req, res) => {
		try {
			const { id } = req.params

			const user = await User.findById(id)
			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'User not found',
				})
			}

			// If user is parent, remove parent reference from all children
			if (user.role === 'parent' && user.children.length > 0) {
				await User.updateMany(
					{ _id: { $in: user.children } },
					{ $set: { parent: null } }
				)
			}

			// If user is student, remove from parent's children array
			if (user.parent) {
				await User.findByIdAndUpdate(user.parent, {
					$pull: { children: user._id },
				})
			}

			// Delete user
			await User.findByIdAndDelete(id)

			res.json({
				success: true,
				message: 'User deleted successfully',
			})
		} catch (err) {
			console.error('Delete user error:', err)
			res.status(500).json({
				success: false,
				message: 'Server error',
				error: err.message,
			})
		}
	},

	// GET PARENT'S CHILDREN
	getParentChildren: async (req, res) => {
		try {
			const { parentId } = req.params

			const parent = await User.findById(parentId)
				.populate({
					path: 'children',
					select: 'name phone role createdAt status',
				})
				.select('-password')

			if (!parent) {
				return res.status(404).json({
					success: false,
					message: 'Parent not found',
				})
			}

			if (parent.role !== 'parent') {
				return res.status(400).json({
					success: false,
					message: 'User is not a parent',
				})
			}

			res.json({
				success: true,
				parent: {
					id: parent._id,
					name: parent.name,
					phone: parent.phone,
					totalChildren: parent.children.length,
				},
				children: parent.children,
			})
		} catch (err) {
			console.error('Get parent children error:', err)

			if (err.name === 'CastError') {
				return res.status(400).json({
					success: false,
					message: 'Invalid parent ID format',
				})
			}

			res.status(500).json({
				success: false,
				message: 'Server error',
				error: err.message,
			})
		}
	},

	// UNLINK PARENT AND STUDENT
	unlinkParentStudent: async (req, res) => {
		try {
			const { parentId, studentId } = req.body

			const parent = await User.findById(parentId)
			const student = await User.findById(studentId)

			if (!parent || !student) {
				return res.status(404).json({
					success: false,
					message: 'Parent or student not found',
				})
			}

			// Remove parent from student
			student.parent = null
			await student.save()

			// Remove student from parent's children
			await User.findByIdAndUpdate(parentId, { $pull: { children: studentId } })

			res.json({
				success: true,
				message: 'Parent and student unlinked successfully',
			})
		} catch (err) {
			console.error('Unlink error:', err)
			res.status(500).json({
				success: false,
				message: 'Server error',
				error: err.message,
			})
		}
	},
}

module.exports = adminController
