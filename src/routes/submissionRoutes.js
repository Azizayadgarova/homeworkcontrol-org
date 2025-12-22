const express = require('express')
const router = express.Router()
const {
	createSubmission,
	getSubmissions,
	updateSubmission,
} = require('../controllers/submissionController')
const { protect } = require('../middlewares/authMiddleware')
const { authorizeRoles } = require('../middlewares/roleMiddleware')

/**
 * @swagger
 * /api/submissions:
 *   get:
 *     summary: Get submissions (all roles)
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Student submit task
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 */
router
	.route('/')
	.get(protect, getSubmissions)
	.post(protect, authorizeRoles('student'), createSubmission)

/**
 * @swagger
 * /api/submissions/{id}:
 *   patch:
 *     summary: Teacher update submission (score/status/comment)
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 */
router.route('/:id').patch(protect, authorizeRoles('teacher'), updateSubmission)

module.exports = router
