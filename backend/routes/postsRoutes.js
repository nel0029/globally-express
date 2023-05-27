const express = require('express')
const router = express.Router()

const { CreatePostDataController } = require('../controllers/postscontrollers/CreatePostDataController')
const { ReadPostDataController } = require('../controllers/postscontrollers/ReadPostDataController')
const { UpdatePostDataController } = require('../controllers/postscontrollers/UpdatePostDataController')
const { DeletePostDataController } = require('../controllers/postscontrollers/DeletePostDataController')

const { protect } = require('../middleware/authMiddleware')

router.route('/')
    .post(protect, CreatePostDataController)
    .get(protect, ReadPostDataController)
    .put(protect, UpdatePostDataController)
    .delete(protect, DeletePostDataController)

module.exports = router