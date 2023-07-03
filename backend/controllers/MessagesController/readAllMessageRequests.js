const asyncHandler = require('express-async-handler')
const { Conversations, Messages, MessageRequests, ConversationRequests } = require('../../models/messageModel');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');


const getAllMessageRequests = asyncHandler(async (req, res) => {

    const { conversationID } = req.params
    const conversationExists = await ConversationRequests.findById(conversationID)

    if (conversationExists) {
        const allMessages = await MessageRequests.find({ conversationID: conversationExists._id.toString() })

        res.status(200).json(allMessages)
    } else {
        res.status(200).json([])
    }

})

module.exports = getAllMessageRequests