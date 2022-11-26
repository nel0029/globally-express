const express = require('express')
const router = express.Router()
const {
    registerUser,
    logInUser,
    getUserInfo
} = require('../controllers/usersController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', logInUser)
router.get('/me', protect, getUserInfo)

module.exports = router