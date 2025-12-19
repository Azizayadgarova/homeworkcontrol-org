const User = require('../models/User')
const Task = require('../models/Task')
const Group = require('../models/Group')

// ✅ GET MY CHILDREN (with detailed info)
exports.getMyChildren = async (req, res) => {
	try {
		const parent = await User.findById(req.user.id).populate({
			path: 'children',
			select: 'name phone role group status createdAt',
			populate: {
				path: 'group',
				select: 'name days time teacher',
				populate: {
					path: 'teacher',
					select: 'name phone',
				},
			},
		})

		if (!parent || parent.role !== 'parent') {
			return res.status(403).json({
				success: false,
				message: 'Access denied',
			})
		}

		// Har bir farzand uchun stats hisoblash
		const childrenWithStats = await Promise.all(
			parent.children.map(async child => {
				const tasks = await Task.find({ student: child._id })

				const stats = {
					totalTasks: tasks.length,
					completedTasks: tasks.filter(t => t.status === 'checked').length,
					pendingTasks: tasks.filter(t => t.status === 'not_submitted').length,
					submittedTasks: tasks.filter(t => t.status === 'submitted').length,
					reworkTasks: tasks.filter(t => t.status === 'rework').length,
					totalScore: tasks.reduce((sum, t) => sum + (t.score || 0), 0),
					averageScore:
						tasks.length > 0
							? (
									tasks.reduce((sum, t) => sum + (t.score || 0), 0) /
									tasks.length
							  ).toFixed(2)
							: 0,
					completionRate:
						tasks.length > 0
							? (
									(tasks.filter(t => t.status === 'checked').length /
										tasks.length) *
									100
							  ).toFixed(2)
							: 0,
				}

				return {
					...child.toObject(),
					stats,
				}
			})
		)

		res.json({
			success: true,
			parent: {
				id: parent._id,
				name: parent.name,
				phone: parent.phone,
				totalChildren: parent.children.length,
			},
			children: childrenWithStats,
			summary: {
				totalChildren: parent.children.length,
				activeChildren: parent.children.filter(c => c.status === 'active')
					.length,
				totalTasks: await Task.countDocuments({
					student: { $in: parent.children.map(c => c._id) },
				}),
				averageScore:
					childrenWithStats.length > 0
						? (
								childrenWithStats.reduce(
									(sum, c) => sum + parseFloat(c.stats.averageScore),
									0
								) / childrenWithStats.length
						  ).toFixed(2)
						: 0,
			},
		})
	} catch (err) {
		console.error('Get children error:', err)
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: err.message,
		})
	}
}

// ✅ GET CHILD TASKS (with filters)
exports.getChildTasks = async (req, res) => {
	try {
		const { childId } = req.params
		const { status, from, to, sort = '-deadline' } = req.query

		const parent = await User.findById(req.user.id)

		// Check if child belongs to parent
		if (!parent.children.includes(childId)) {
			return res.status(403).json({
				success: false,
				message: 'Access denied to this child',
			})
		}

		// Build query
		const query = { student: childId }

		if (status) {
			query.status = status
		}

		if (from || to) {
			query.deadline = {}
			if (from) query.deadline.$gte = new Date(from)
			if (to) query.deadline.$lte = new Date(to)
		}

		const tasks = await Task.find(query)
			.populate('group', 'name days time')
			.populate('student', 'name phone')
			.sort(sort)
			.lean()

		// Add human readable time
		const tasksWithTime = tasks.map(task => ({
			...task,
			timeLeft: task.deadline
				? Math.ceil(
						(new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
				  )
				: null,
			isOverdue: task.deadline
				? new Date(task.deadline) < new Date() && task.status !== 'checked'
				: false,
		}))

		res.json({
			success: true,
			childId,
			total: tasks.length,
			tasks: tasksWithTime,
			stats: {
				total: tasks.length,
				not_submitted: tasks.filter(t => t.status === 'not_submitted').length,
				submitted: tasks.filter(t => t.status === 'submitted').length,
				rework: tasks.filter(t => t.status === 'rework').length,
				checked: tasks.filter(t => t.status === 'checked').length,
				overdue: tasksWithTime.filter(t => t.isOverdue).length,
			},
		})
	} catch (err) {
		console.error('Get child tasks error:', err)
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: err.message,
		})
	}
}

// ✅ GET CHILD DETAILED RATING
exports.getChildRating = async (req, res) => {
	try {
		const { childId } = req.params
		const { period = 'all' } = req.query // week, month, all

		const parent = await User.findById(req.user.id)

		if (!parent.children.includes(childId)) {
			return res.status(403).json({
				success: false,
				message: 'Access denied to this child',
			})
		}

		// Date filter for period
		const dateFilter = {}
		const now = new Date()

		if (period === 'week') {
			const weekAgo = new Date(now.setDate(now.getDate() - 7))
			dateFilter.createdAt = { $gte: weekAgo }
		} else if (period === 'month') {
			const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
			dateFilter.createdAt = { $gte: monthAgo }
		}

		const tasks = await Task.find({
			student: childId,
			...dateFilter,
		}).sort('createdAt')

		// Calculate detailed stats
		const stats = {
			period,
			totalTasks: tasks.length,
			completedTasks: tasks.filter(t => t.status === 'checked').length,
			submittedTasks: tasks.filter(t => t.status === 'submitted').length,
			pendingTasks: tasks.filter(t => t.status === 'not_submitted').length,
			reworkTasks: tasks.filter(t => t.status === 'rework').length,
			totalScore: tasks.reduce((sum, t) => sum + (t.score || 0), 0),
			maxScore:
				tasks.length > 0 ? Math.max(...tasks.map(t => t.score || 0)) : 0,
			minScore:
				tasks.length > 0
					? Math.min(...tasks.filter(t => t.score > 0).map(t => t.score || 0))
					: 0,
			averageScore:
				tasks.length > 0
					? (
							tasks.reduce((sum, t) => sum + (t.score || 0), 0) / tasks.length
					  ).toFixed(2)
					: 0,
			completionRate:
				tasks.length > 0
					? (
							(tasks.filter(t => t.status === 'checked').length /
								tasks.length) *
							100
					  ).toFixed(2)
					: 0,
		}

		// Group by month for chart data
		const monthlyData = tasks.reduce((acc, task) => {
			const month = task.createdAt.toISOString().slice(0, 7) // YYYY-MM
			if (!acc[month]) {
				acc[month] = { count: 0, totalScore: 0, tasks: [] }
			}
			acc[month].count++
			acc[month].totalScore += task.score || 0
			acc[month].tasks.push({
				id: task._id,
				title: task.title,
				score: task.score,
				status: task.status,
				date: task.createdAt,
			})
			return acc
		}, {})

		// Convert to array for chart
		const chartData = Object.entries(monthlyData)
			.map(([month, data]) => ({
				month,
				count: data.count,
				averageScore:
					data.count > 0 ? (data.totalScore / data.count).toFixed(2) : 0,
			}))
			.sort((a, b) => a.month.localeCompare(b.month))

		res.json({
			success: true,
			childId,
			period,
			stats,
			chartData,
			recentTasks: tasks.slice(-5).map(t => ({
				id: t._id,
				title: t.title,
				score: t.score,
				status: t.status,
				comment: t.comment,
				date: t.createdAt,
			})),
			recommendations: getRecommendations(stats),
		})
	} catch (err) {
		console.error('Get child rating error:', err)
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: err.message,
		})
	}
}

// ✅ ADD CHILD (if parent wants to add child manually)
exports.addChild = async (req, res) => {
	try {
		const { childPhone } = req.body
		const parentId = req.user.id

		// Find parent
		const parent = await User.findById(parentId)
		if (!parent || parent.role !== 'parent') {
			return res.status(403).json({
				success: false,
				message: 'Access denied',
			})
		}

		// Find child by phone
		const child = await User.findOne({
			phone: childPhone,
			role: 'student',
		})

		if (!child) {
			return res.status(404).json({
				success: false,
				message: 'Student not found',
			})
		}

		// Check if already linked
		if (parent.children.includes(child._id)) {
			return res.status(409).json({
				success: false,
				message: 'Child already added',
			})
		}

		// Update child's parent
		child.parent = parentId
		await child.save()

		// Update parent's children
		parent.children.push(child._id)
		await parent.save()

		res.json({
			success: true,
			message: 'Child added successfully',
			child: {
				id: child._id,
				name: child.name,
				phone: child.phone,
			},
			parent: {
				id: parent._id,
				name: parent.name,
				totalChildren: parent.children.length,
			},
		})
	} catch (err) {
		console.error('Add child error:', err)
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: err.message,
		})
	}
}

// Helper function for recommendations
function getRecommendations(stats) {
	const recommendations = []

	if (stats.completionRate < 50) {
		recommendations.push(
			'Increase task completion rate - try setting daily goals'
		)
	}

	if (stats.averageScore < 70) {
		recommendations.push(
			'Focus on improving quality of work - review feedback carefully'
		)
	}

	if (stats.pendingTasks > 5) {
		recommendations.push(
			'Too many pending tasks - prioritize and complete them'
		)
	}

	if (stats.reworkTasks > 0) {
		recommendations.push(
			'Pay attention to rework tasks - understand what needs improvement'
		)
	}

	if (recommendations.length === 0) {
		recommendations.push('Great progress! Keep up the good work')
	}

	return recommendations
}
