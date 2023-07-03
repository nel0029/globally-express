const asyncHandler = require('express-async-handler');
const { ConversationMembers } = require('../../models/messageModel');
const { ObjectId } = require('mongodb');

const readUnseenMessagesCount = asyncHandler(async (req, res) => {
    const { userID } = req.params

    const unseenMessages = await ConversationMembers.aggregate([
        {
            $match: {
                senderID: new ObjectId(userID) // Corrected the field name from "recieverID" to "receiverID"
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
    ]);


    res.status(200).json(unseenMessages[0])

})

module.exports = readUnseenMessagesCount