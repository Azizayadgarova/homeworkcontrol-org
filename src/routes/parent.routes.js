const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth.middleware')
const {
	getMyChildren,
	getChildTasks,
	getChildRating,
	addChild,
} = require('../controllers/parent.controller')

// All routes require parent role
router.use(authMiddleware(['parent']))

router.get('/children', getMyChildren)
router.get('/tasks/:childId', getChildTasks)
router.get('/rating/:childId', getChildRating)
router.post('/add-child', addChild)

module.exports = router
