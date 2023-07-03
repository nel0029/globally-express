const express = require('express')
const router = express.Router()


//Auth Middleware
const { protect } = require('../middleware/authMiddleware')
const uploadMiddleware = require('../middleware/uploadMiddleware')


// Create Controllers
const createNewPost = require('../controllers/postsControllers/createNewPost')
const createNewReply = require('../controllers/postsControllers/createNewReply')
const createNewRepost = require('../controllers/postsControllers/createNewRepost')
const createNewLike = require('../controllers/postsControllers/createNewLike')
const createNewPollResponse = require('../controllers/postsControllers/createNewPollResponse')



//Delete Controllers
const deletePost = require('../controllers/postsControllers/deletePost')
const deleteReply = require('../controllers/postsControllers/deleteReply')
const deleteRepost = require('../controllers/postsControllers/deleteRepost')
const deleteLike = require('../controllers/postsControllers/deleteLike')


//Update Controllers
const updatePost = require('../controllers/postsControllers/updatePost')
const updateReply = require('../controllers/postsControllers/updateReply')
const updateRepost = require('../controllers/postsControllers/updateRepost')



//Read All post Controller
const readAllPostData = require('../controllers/postsControllers/readAllPostData')
const readPostDetails = require('../controllers/postsControllers/readPostDetails')
const readAllRepliesByPostID = require('../controllers/postsControllers/readAllRepliesByPostID')
const readReplyDetails = require('../controllers/postsControllers/readReplyDetails')
const readRepostDetails = require('../controllers/postsControllers/readRepostDetails')
const readAllPostsByUser = require('../controllers/postsControllers/readAllPostsByUser')
const readAllRepliesByUser = require('../controllers/postsControllers/readAllRepliesByUser')
const readAllRepostsByUser = require('../controllers/postsControllers/readAllRepostsByUser')
const readAllLikesByUser = require('../controllers/postsControllers/readAllLikesByUser')



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