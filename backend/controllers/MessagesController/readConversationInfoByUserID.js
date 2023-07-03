const asyncHandler = require('express-async-handler')
const { Conversations, ConversationMembers } = require('../../models/messageModel');
const { Users } = require('../../models/userModel')
const { ObjectId } = require('mongodb');

const readConversationInfoByUserID = asyncHandler(async (req, res) => {
    const { senderID, receiverID } = req.query

    const response = {
        conversationInfo: null,
        receiverInfo: null
    }

    const conversationMemberExists = await ConversationMembers.findOne({ senderID: senderID, receiverID: receiverID })

    if (conversationMemberExists) {
        const conversations = await Conversations.aggregate([
            {
                $match: {
                    _id: conversationMemberExists.conversationID
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
                    localField: "members.receiverID",
                    foreignField: "_id",
                    as: "receiver"
                }
            },
            {
                $addFields: {
                    receiverFirstName: { $arrayElemAt: ["$receiver.userFirstName", 0] },
                    receiverMiddleName: { $arrayElemAt: ["$receiver.userMiddleName", 0] },
                    receiverLastName: { $arrayElemAt: ["$receiver.userLastName", 0] },
                    receiverID: { $arrayElemAt: ["$receiver._id", 0] },
                    userName: { $arrayElemAt: ["$receiver.userName", 0] },
                    avatarURL: { $arrayElemAt: ["$receiver.avatarURL", 0] },
                }
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    receiverFirstName: 1,
                    receiverMiddleName: 1,
                    receiverLastName: 1,
                    receiverID: 1,
                    userName: 1,
                    avatarURL: { $concat: [basePath, "$avatarURL"] },
                    createdAt: 1,
                }
            },

        ])


        const conversation = conversations[0]
        response.conversationInfo = conversation

        const result = response

        res.status(200).json(result)
    } else {

        const user = await Users.findById(receiverID, { _id: 1, userName: 1, userFirstName: 1, userMiddleName: 1, userLastName: 1, avatarURL: 1 })

        response.receiverInfo = user

        const result = response
        res.status(200).json(result)


    }
})

module.exports = readConversationInfoByUserID