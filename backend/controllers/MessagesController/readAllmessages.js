const asyncHandler = require('express-async-handler')
const { Conversations, Messages } = require('../../models/messageModel');
const mongoose = require('mongoose');


const readAllMessages = asyncHandler(async (req, res) => {

    const { conversationID } = req.params

    const conversationExists = await Conversations.findById(conversationID)

    if (conversationExists) {
        const allMessages = await Messages.find({ conversationID: conversationExists._id.toString() })

        res.status(200).json(allMessages)
    } else {
        res.status(200).json([])
    }

})

module.exports = readAllMessages