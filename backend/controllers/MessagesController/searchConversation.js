const asyncHandler = require('express-async-handler');
const { Conversations, ConversationMembers } = require('../../models/messageModel');
const { Users } = require('../../models/userModel');
const { ObjectId } = require('mongodb');

const searchConversation = asyncHandler(async (req, res) => {
    const { senderID } = req.params
    const { userName } = req.query

    const userNameExists = await Users.findOne({ userName: { $regex: userName, $options: 'i' } })

    if (userNameExists) {

    }
})