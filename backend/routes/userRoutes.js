const express = require('express')
const router = express.Router()
const {
    registerUser,
    logInUser,
    getUserInfo
} = require('../controllers/usersController')

router.post('/register', registerUser)
router.post('/login', logInUser)
router.get('/me', getUserInfo)

module.exports = router