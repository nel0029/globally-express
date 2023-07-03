const express = require('express')
const router = express.Router()


//Auth Middleware
const { protect } = require('../middleware/authMiddleware')
const uploadMiddleware = require('../middleware/uploadMiddleware')


// Create Controllers
const createNewPost = require('../controllers/PostsControllers/createNewPost')
const createNewReply = require('../controllers/PostsControllers/createNewReply')
const createNewRepost = require('../controllers/PostsControllers/createNewRepost')
const createNewLike = require('../controllers/PostsControllers/createNewLike')
const createNewPollResponse = require('../controllers/PostsControllers/createNewPollResponse')



//Delete Controllers
const deletePost = require('../controllers/PostsControllers/deletePost')
const deleteReply = require('../controllers/PostsControllers/deleteReply')
const deleteRepost = require('../controllers/PostsControllers/deleteRepost')
const deleteLike = require('../controllers/PostsControllers/deleteLike')


//Update Controllers
const updatePost = require('../controllers/PostsControllers/updatePost')
const updateReply = require('../controllers/PostsControllers/updateReply')
const updateRepost = require('../controllers/PostsControllers/updateRepost')


//Read All post Controller
const readAllPostData = require('../controllers/PostsControllers/readAllPostData')
const readPostDetails = require('../controllers/PostsControllers/readPostDetails')
const readAllRepliesByPostID = require('../controllers/PostsControllers/readAllRepliesByPostID')
const readReplyDetails = require('../controllers/PostsControllers/readReplyDetails')
const readRepostDetails = require('../controllers/PostsControllers/readRepostDetails')
const readAllPostsByUser = require('../controllers/PostsControllers/readAllPostsByUser')
const readAllRepliesByUser = require('../controllers/PostsControllers/readAllRepliesByUser')
const readAllRepostsByUser = require('../controllers/PostsControllers/readAllRepostsByUser')
const readAllLikesByUser = require('../controllers/PostsControllers/readAllLikesByUser')



router.post('/new/post', [protect, uploadMiddleware], createNewPost)
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