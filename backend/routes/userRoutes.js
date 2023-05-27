const express = require('express')
const router = express.Router()


const { registerUser } = require('../controllers/AuthUsersControllers/registerUserController')
const { logInUser } = require('../controllers/AuthUsersControllers/logInUserController')

router.post('/register', registerUser)
router.post('/login', logInUser)

module.exports = router