const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')

const readContactList = require('../controllers/MessagesController/readContactList')
const readConversationList = require('../controllers/MessagesController/readConversationList')
const readConversationInfo = require('../controllers/MessagesController/readConversationInfo')
const readAllMessages = require('../controllers/MessagesController/readAllmessages')
const readConversationRequestList = require('../controllers/MessagesController/readConversationRequestList')
const readConversationRequestInfo = require('../controllers/MessagesController/readConversationRequestInfo')
const readConversationInfoByUserID = require('../controllers/MessagesController/readConversationInfoByUserID')
const readUnseenMessagesCount = require('../controllers/MessagesController/readUnseenMessagesCount')


router.get('/contacts', protect, readContactList)
router.get('/conversations', protect, readConversationList)
router.get('/conversations/search', protect, readConversationInfoByUserID)
router.get('/conversations/requests', protect, readConversationRequestList)
router.get('/conversations/requests/:conversationID', protect, readConversationRequestInfo)
router.get('/conversations/:conversationID', protect, readConversationInfo)
router.get('/conversations/:conversationID/messages', protect, readAllMessages)
router.get('/unseen/:userID', protect, readUnseenMessagesCount)



module.exports = router