const express = require('express')
const router = express.Router()

const readAllNotifications = require('../controllers/NotificationsControllers/readAllNotifications')
const readUnseenNotifications = require('../controllers/NotificationsControllers/readUnseenNotifications')
const { protect } = require('../middleware/authMiddleware')


router.get('/', protect, readAllNotifications)
router.get('/:userID', protect, readUnseenNotifications)

module.exports = router