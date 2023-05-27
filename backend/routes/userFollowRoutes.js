const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')
const { CreateUserFollow } = require('../controllers/UsersController/CreateUserFollow')

router.route('/follow')
    .post(protect, CreateUserFollow)

module.exports = router