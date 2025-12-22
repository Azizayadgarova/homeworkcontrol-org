const express = require('express')
const router = express.Router()
const {
	createSubmission,
	getSubmissions,
	updateSubmission,
} = require('../controllers/submissionController')
const { protect } = require('../middlewares/authMiddleware')
const { authorizeRoles } = require('../middlewares/roleMiddleware')

router
	.route('/')
	.get(protect, getSubmissions)
	.post(protect, authorizeRoles('student'), createSubmission)

router.route('/:id').patch(protect, authorizeRoles('teacher'), updateSubmission)

module.exports = router
