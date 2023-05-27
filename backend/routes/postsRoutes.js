const express = require('express')
const router = express.Router()

const { CreatePostDataController } = require('../controllers/PostsControllers/CreatePostDataController')
const { ReadPostDataController } = require('../controllers/PostsControllers/ReadPostDataController')
const { UpdatePostDataController } = require('../controllers/PostsControllers/UpdatePostDataController')
const { DeletePostDataController } = require('../controllers/PostsControllers/DeletePostDataController')

const { protect } = require('../middleware/authMiddleware')

router.route('/')
    .post(protect, CreatePostDataController)
    .get(protect, ReadPostDataController)
    .put(protect, UpdatePostDataController)
    .delete(protect, DeletePostDataController)

module.exports = router