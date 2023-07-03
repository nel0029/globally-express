const asyncHandler = require('express-async-handler')
const { Conversations, MessageRequests, ConversationRequests } = require('../../models/messageModel');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');


const readConversationRequestList = asyncHandler(async (req, res) => {

    const { userID } = req.query

    const conversationRequests = await ConversationRequests.aggregate([
        {
            $match: {
                receiverID: new ObjectId(userID)
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "requesterID",
                foreignField: "_id",
                as: "requester"
            }
        },
        {
            $project: {
                requesterID: 1,
                conversationID: 1,
                requesterFirstName: { $arrayElemAt: ["$requester.userFirstName", 0] },
                requesterMiddleName: { $arrayElemAt: ["$requester.userMiddleName", 0] },
                requesterLastName: { $arrayElemAt: ["$requester.userLastName", 0] },
                requesterUserName: { $arrayElemAt: ["$requester.userName", 0] },
                requesterAvatarURL: { $arrayElemAt: ["$requester.avatarURL", 0] },
                unseenMessagesCount: 1,
                lastMessage: 1,
                lastMessageID: 1,
                lastMessageTimestamps: 1,
                createdAt: 1,
            }
        }
    ])

    res.status(200).json(conversationRequests)

})

module.exports = readConversationRequestList