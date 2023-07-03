const { ObjectId } = require('mongodb');
const { Conversations, ConversationMembers } = require('../../../models/messageModel');
const { ActiveUsers } = require('../../../models/userModel');

const joinConversation = async (data, socket, io) => {
    const { conversationID, memberID } = data
    const conversationExists = await Conversations.findById(conversationID)
    if (conversationExists) {
        const memberExists = await ConversationMembers.findOne({ $and: [{ conversationID: conversationExists._id }, { senderID: memberID }] })


        if (memberExists) {
            socket.join(memberExists.conversationID)
            memberExists.unseenMessagesCount = 0
            await memberExists.save()

            const userSocketID = await ActiveUsers.findOne({ userID: memberID })

            if (memberExists) {
                const conversations = await ConversationMembers.aggregate([
                    {
                        $match: {
                            senderID: memberExists.senderID,
                            conversationID: memberExists.conversationID
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "receiverID",
                            foreignField: "_id",
                            as: "receiver"
                        }
                    },
                    {
                        $lookup: {
                            from: "conversations",
                            localField: "conversationID",
                            foreignField: "_id",
                            as: "conversation"
                        }
                    },
                    {
                        $project: {
                            _id: { $arrayElemAt: ["$conversation._id", 0] },
                            senderID: 1,
                            receiverID: 1,
                            unseenMessagesCount: 1,
                            type: { $arrayElemAt: ["$conversation.type", 0] },
                            createdAt: { $arrayElemAt: ["$conversation.createdAt", 0] },
                            lastMessage: { $arrayElemAt: ["$conversation.lastMessage", 0] },
                            lastMessageID: { $arrayElemAt: ["$conversation.lastMessageID", 0] },
                            lastMessageTimestamps: { $arrayElemAt: ["$conversation.lastMessageTimestamps", 0] },
                            userName: { $arrayElemAt: ["$receiver.userName", 0] },
                            avatarURL: { $arrayElemAt: ["$receiver.avatarURL", 0] },
                            receiverFirstName: { $arrayElemAt: ["$receiver.userFirstName", 0] },
                            receiverMiddleName: { $arrayElemAt: ["$receiver.userMiddleName", 0] },
                            receiverLastName: { $arrayElemAt: ["$receiver.userLastName", 0] },
                        }
                    }
                ])

                io.to(userSocketID.socketID).emit("joinConversation", conversations[0])
            }
        }
    }
}


module.exports = joinConversation