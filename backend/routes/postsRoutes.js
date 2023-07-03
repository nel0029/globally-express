const express = require('express')
const router = express.Router()


//Auth Middleware
const { protect } = require('../middleware/authMiddleware')
const uploadMiddleware = require('../middleware/uploadMiddleware')


// Create Controllers

const createNewReply = require('../controllers/PostControllers/createNewReply')
const createNewRepost = require('../controllers/PostControllers/createNewRepost')
const createNewLike = require('../controllers/PostControllers/createNewLike')
const createNewPollResponse = require('../controllers/PostControllers/createNewPollResponse')
//const createNewPost = require('../controllers/PostControllers/createNewPost')
const createPost = require('../controllers/PostControllers/createPost')



//Delete Controllers
const deletePost = require('../controllers/PostControllers/deletePost')
const deleteReply = require('../controllers/PostControllers/deleteReply')
const deleteRepost = require('../controllers/PostControllers/deleteRepost')
const deleteLike = require('../controllers/PostControllers/deleteLike')


//Update Controllers
const updatePost = require('../controllers/PostControllers/updatePost')
const updateReply = require('../controllers/PostControllers/updateReply')
const updateRepost = require('../controllers/PostControllers/updateRepost')



//Read All post Controller
const readAllPostData = require('../controllers/PostControllers/readAllPostData')
const readPostDetails = require('../controllers/PostControllers/readPostDetails')
const readAllRepliesByPostID = require('../controllers/PostControllers/readAllRepliesByPostID')
const readReplyDetails = require('../controllers/PostControllers/readReplyDetails')
const readRepostDetails = require('../controllers/PostControllers/readRepostDetails')
const readAllPostsByUser = require('../controllers/PostControllers/readAllPostsByUser')
const readAllRepliesByUser = require('../controllers/PostControllers/readAllRepliesByUser')
const readAllRepostsByUser = require('../controllers/PostControllers/readAllRepostsByUser')
const readAllLikesByUser = require('../controllers/PostControllers/readAllLikesByUser')



router.post('/new/post', [protect, uploadMiddleware], createPost)
router.post('/new/reply', [protect, uploadMiddleware], createNewReply)
router.post('/new/repost', [protect, uploadMiddleware], createNewRepost)
router.post('/new/like', protect, createNewLike)
router.post('/new/poll/response', protect, createNewPollResponse)


router.delete('/delete/post', protect, deletePost)
router.delete('/delete/reply', protect, deleteReply)
router.delete('/delete/repost', protect, deleteRepost)
router.delete('/delete/like', protect, deleteLike)


router.put('/update/post', protect, updatePost)
router.put('/update/reply', protect, updateReply)
router.put('/update/repost', protect, updateRepost)

router.get('/all/posts', protect, readAllPostData)
router.get('/:userName/likes', protect, readAllLikesByUser)
router.get('/:userName/posts', protect, readAllPostsByUser)
router.get('/:userName/replies', protect, readAllRepliesByUser)
router.get('/:userName/reposts', protect, readAllRepostsByUser)
router.get('/:userName/posts/:postID', protect, readPostDetails)
router.get('/:userName/replies/:postID', protect, readReplyDetails)
router.get('/:userName/reposts/:postID', protect, readRepostDetails)
router.get('/:userName/posts/:postID/replies', protect, readAllRepliesByPostID)



module.exports = router