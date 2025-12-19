const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth.middleware')
const {
	getGroups,
	getGroupTasks,
	gradeTask,
} = require('../controllers/teacher.controller')

router.use(authMiddleware(['teacher']))

/**
 * @swagger
 * /api/teacher/groups:
 *   get:
 *     summary: Get all groups assigned to the teacher
 *     tags: [Teacher]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of groups }
 *
 * /api/teacher/groups/{groupId}/tasks:
 *   get:
 *     summary: Get all tasks for a specific group
 *     tags: [Teacher]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of tasks in the group }
 *
 * /api/teacher/tasks/{taskId}/grade:
 *   put:
 *     summary: Grade a student task
 *     tags: [Teacher]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [score, status]
 *             properties:
 *               score: { type: number, description: '0-100' }
 *               status:
 *                 type: string
 *                 enum: [not_submitted, submitted, resubmit, checked]
 *               comment: { type: string }
 *     responses:
 *       200: { description: Task graded successfully }
 *       404: { description: Task not found }
 */
router.get('/groups', getGroups)
router.get('/groups/:groupId/tasks', getGroupTasks)
router.put('/tasks/:taskId/grade', gradeTask)

module.exports = router
