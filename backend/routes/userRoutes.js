const express = require('express')
const router = express.Router()
const {
    getUserInfo
} = require('../controllers/usersController')
const { protect } = require('../middleware/authMiddleware')

const { registerUser } = require('../controllers/AuthUsersControllers/registerUserController')
const { logInUser } = require('../controllers/AuthUsersControllers/logInUserController')

router.post('/register', registerUser)
router.post('/login', logInUser)
router.get('/me', protect, getUserInfo)

module.exports = router