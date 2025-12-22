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
 * /submissions:
 *   get:
 *     summary: Get all submissions (student or teacher)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of submissions
 */
router.get('/', protect, getSubmissions)

/**
 * @swagger
 * /submissions:
 *   post:
 *     summary: Create a submission (student)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - content
 *             properties:
 *               taskId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Submission created
 */
router.post('/', protect, authorizeRoles('student'), createSubmission)

/**
 * @swagger
 * /submissions/{id}:
 *   patch:
 *     summary: Update submission (teacher only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade:
 *                 type: string
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission updated
 */
router.patch('/:id', protect, authorizeRoles('teacher'), updateSubmission)

module.exports = router
