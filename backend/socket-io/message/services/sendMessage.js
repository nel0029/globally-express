const { ObjectId } = require('mongodb');
const { Messages, Conversations, ConversationRequests, ConversationMembers } = require('../../../models/messageModel');
const { ActiveUsers } = require('../../../models/userModel');

const sendMessage = async (data, socket, io) => {

    const { conversationID, senderID, text } = data;


    const conversationExists = await Conversations.findOne({ $and: [{ _id: conversationID }, { senderID: senderID }] })

    if (conversationExists) {

        const senderMembershipExists = await ConversationMembers.findOne({ $and: [{ conversationID: conversationExists._id }, { senderID: senderID }] })

        if (senderMembershipExists) {

            const newMessage = new Messages({
                conversationID: conversationExists._id,
                senderID: senderID,
                text: text
            })

            await newMessage.save()

            conversationExists.lastMessage = newMessage.text
            conversationExists.lastMessageID = newMessage._id
            conversationExists.lastMessageTimestamps = newMessage.createdAt

            await conversationExists.save()


            const senderConvo = await ConversationMembers.aggregate([
                {
                    $match: {
                        senderID: senderMembershipExists.senderID
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "receiverID",
                        foreignField: "_id",
                        as: "receiver",
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
                    $addFields: {
                        receiver: {
                            $arrayElemAt: ["$receiver", 0]
                        },
                        conversation: {
                            $arrayElemAt: ["$conversation", 0]
                        }
                    }
                },
                {
                    $project: {
                        _id: "$conversation._id",
                        senderID: 1,
                        receiverID: 1,
                        unseenMessagesCount: 1,
                        receiverFirstName: "$receiver.userFirstName",
                        receiverMiddleName: "$receiver.userMiddleName",
                        receiverLastName: "$receiver.userLastName",
                        userName: "$receiver.userName",
                        avatarURL: "$receiver.avatarURL",
                        createdAt: "$conversation.createdAt",
                        lastMessage: "$conversation.lastMessage",
                        lastMessageID: "$conversation.lastMessageID",
                        lastMessageTimestamps: "$conversation.lastMessageTimestamps"
                    }
                }
            ])

            const forSender = {
                conversation: senderConvo[0],
                message: newMessage
            }

            const receiverMembershipExist = await ConversationMembers.findOne({
                convesationID: senderMembershipExists.conversationID,
                senderID: senderMembershipExists.receiverID
            })


            receiverMembershipExist.unseenMessagesCount = +1
            await receiverMembershipExist.save()

            const unseenMessages = await ConversationMembers.aggregate([
                {
                    $match: {
                        recieverID: senderConvo.receiverID
                    }
                },
                {
                    $group: {
                        _id: null,
                        unseenMessagesCount: {
                            $sum: "$unseenMessagesCount"
                        }
                    }
                }
            ])
            const isSenderActive = await ActiveUsers.findOne({ userID: senderMembershipExists.senderID })
            const isReceiverActive = await ActiveUsers.findOne({ userID: senderMembershipExists.receiverID })

            if (isReceiverActive) {
                const receiverConvo = await ConversationMembers.aggregate([
                    {
                        $match: {
                            senderID: receiverMembershipExist.senderID
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "receiverID",
                            foreignField: "_id",
                            as: "receiver",
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
                        $addFields: {
                            receiver: {
                                $arrayElemAt: ["$receiver", 0]
                            },
                            conversation: {
                                $arrayElemAt: ["$conversation", 0]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: "$conversation._id",
                            senderID: 1,
                            receiverID: 1,
                            unseenMessagesCount: 1,
                            receiverFirstName: "$receiver.userFirstName",
                            receiverMiddleName: "$receiver.userMiddleName",
                            receiverLastName: "$receiver.userLastName",
                            userName: "$receiver.userName",
                            avatarURL: "$receiver.avatarURL",
                            createdAt: "$conversation.createdAt",
                            lastMessage: "$conversation.lastMessage",
                            lastMessageID: "$conversation.lastMessageID",
                            lastMessageTimestamps: "$conversation.lastMessageTimestamps"
                        }
                    }
                ])

                const forReceiver = {
                    conversation: receiverConvo[0],
                    message: newMessage
                }


                io.to(isReceiverActive.socketID).emit("receiveMessage", forReceiver)
                io.to(isSenderActive.socketID).emit("sendMessage", forSender)
                io.to(isReceiverActive.socketID).emit("newMessageCount", unseenMessages[0])
            } else {
                io.to(isSenderActive.socketID).emit("sendMessage", forSender)

            }
        }
    }


};


module.exports = sendMessage;