const asyncHandler = require('express-async-handler')
const { Conversations } = require('../../models/messageModel');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');


const readConversationRequestInfo = asyncHandler(async (req, res) => {

    const { conversationID } = req.params

    const conversations = await Conversations.aggregate([
        {
            $match: {
                _id: new ObjectId(conversationID)
            }
        },
        {
            $lookup: {
                from: "conversationmembers",
                localField: "_id",
                foreignField: "conversationID",
                as: "members"
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "members.senderID",
                foreignField: "_id",
                as: "sender"
            }
        },
        {
            $addFields: {
                senderFirstName: { $arrayElemAt: ["$sender.userFirstName", 0] },
                senderMiddleName: { $arrayElemAt: ["$sender.userMiddleName", 0] },
                senderLastName: { $arrayElemAt: ["$sender.userLastName", 0] },
                senderID: { $arrayElemAt: ["$sender._id", 0] },
                userName: { $arrayElemAt: ["$sender.userName", 0] },
                avatarURL: { $arrayElemAt: ["$sender.avatarURL", 0] },
            }
        },
        {
            $project: {
                _id: 1,
                type: 1,
                senderFirstName: 1,
                senderMiddleName: 1,
                senderLastName: 1,
                senderID: 1,
                userName: 1,
                avatarURL: 1,
                createdAt: 1,
            }
        },

    ])

    const conversationInfo = conversations[0]

    res.status(200).json(conversationInfo)

})

module.exports = readConversationRequestInfo