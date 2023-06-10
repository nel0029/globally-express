const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')
const { CreateUserFollow } = require('../controllers/UsersController/CreateUserFollow')
const ReadUserDetails = require('../controllers/UsersController/ReadUserDetails')
const DeleteUserFollow = require('../controllers/UsersController/DeleteUserFollow')

router.post('/follow', protect, CreateUserFollow)
router.delete('/unfollow', protect, DeleteUserFollow)
router.get('/:userName', protect, ReadUserDetails)

module.exports = router