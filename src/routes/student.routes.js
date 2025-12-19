const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth.middleware')
const { getMyTasks, submitTask } = require('../controllers/student.controller')

router.use(authMiddleware(['student']))

router.get('/tasks', getMyTasks)
router.put('/tasks/submit', submitTask)

module.exports = router
