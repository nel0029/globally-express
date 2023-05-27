const express = require('express')
const router = express.Router()

const { CreatePostDataController } = require('../controllers/PostsControllers/CreatePostDataController')
const { ReadPostDataController } = require('../controllers/PostsControllers/ReadPostDataController')
const { UpdatePostDataController } = require('../controllers/PostsControllers/UpdatePostDataController')
const { DeletePostDataController } = require('../controllers/PostsControllers/DeletePostDataController')

const { createNewPost } = require('../controllers/PostsControllers/createNewPost')
const { createNewReply } = require('../controllers/PostsControllers/createNewReply')
const { createNewRepost } = require('../controllers/PostsControllers/createNewRepost')
const { createNewLike } = require('../controllers/PostsControllers/createNewLike')

const { protect } = require('../middleware/authMiddleware')


router.post()

router.route('/')
    .post(protect, CreatePostDataController)
    .get(protect, ReadPostDataController)
    .put(protect, UpdatePostDataController)
    .delete(protect, DeletePostDataController)

module.exports = router