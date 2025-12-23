import express from 'express'
import {
	createHomework,
	getHomeworksByGroup,
} from '../controllers/homeworkController.js'
import { allowRoles, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', protect, allowRoles('teacher', 'admin'), createHomework)
router.get('/:groupId', protect, getHomeworksByGroup)

export default router
