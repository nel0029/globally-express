const express = require('express')
const router = express.Router()


const { registerUser } = require('../controllers/AuthUsersControllers/registerUserController')
const { logInUser } = require('../controllers/AuthUsersControllers/logInUserController')
const verifyUserName = require('../controllers/AuthUsersControllers/verifyUserName')


router.post('/register', registerUser)
router.post('/login', logInUser)
router.get('/verify/username', verifyUserName)



module.exports = router