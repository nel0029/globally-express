const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')
const uploadProfilePicture = require('../middleware/uploadProfilePicture')
const { CreateUserFollow } = require('../controllers/UsersController/CreateUserFollow')
const ReadUserDetails = require('../controllers/UsersController/ReadUserDetails')
const DeleteUserFollow = require('../controllers/UsersController/DeleteUserFollow')
const ReadUserFollowing = require('../controllers/UsersController/ReadUserFollowing')
const ReadUserFollowers = require('../controllers/UsersController/ReadUserFollowers')
const SearchUser = require('../controllers/UsersController/SearchUser')
const ReadAccountDetails = require('../controllers/UsersController/ReadAccountDetails')
const UpdateUserAccount = require('../controllers/UsersController/UpdateUserAccount')
const ReadUsersToFollow = require('../controllers/UsersController/ReadUsersToFollow')


router.post('/follow', protect, CreateUserFollow)
router.post('/suggested', protect, ReadUsersToFollow)
router.put('/account/update', [protect, uploadProfilePicture], UpdateUserAccount)

router.delete('/unfollow', protect, DeleteUserFollow)
router.get('/search', protect, SearchUser)
router.get('/account/data/:userID', protect, ReadAccountDetails)
router.get('/:userName', protect, ReadUserDetails)
router.get('/:userName/following', protect, ReadUserFollowing)
router.get('/:userName/followers', protect, ReadUserFollowers)


module.exports = router