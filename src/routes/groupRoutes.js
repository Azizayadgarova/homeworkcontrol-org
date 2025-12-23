const express = require('express')
const router = express.Router()

const {
	createGroup,
	getGroups,
	updateGroup,
	deleteGroup,
	addStudentToGroup,
} = require('../controllers/groupController')

const { protect } = require('../middlewares/authMiddleware')
const { authorizeRoles } = require('../middlewares/roleMiddleware')

// GET all groups
router.get('/', protect, getGroups)

// CREATE group (ADMIN)
router.post('/', protect, authorizeRoles('admin'), createGroup)

// UPDATE group (ADMIN)
router.patch('/:id', protect, authorizeRoles('admin'), updateGroup)

// DELETE group (ADMIN)
router.delete('/:id', protect, authorizeRoles('admin'), deleteGroup)

// ✅ ADD student to group (ADMIN / TEACHER)
router.post(
	'/add-student',
	protect,
	authorizeRoles('admin', 'teacher'),
	addStudentToGroup
)

module.exports = router
