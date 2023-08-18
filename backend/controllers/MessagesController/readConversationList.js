/** @format */

const asyncHandler = require("express-async-handler");
const {
  Conversations,
  ConversationMembers,
} = require("../../models/messageModel");
const { ObjectId } = require("mongodb");

const basePath = process.env.BASE_PATH;

const readConversationList = asyncHandler(async (req, res) => {
  const { userID } = req.query;

  const conversations = await ConversationMembers.aggregate([
    {
      $match: {
        senderID: new ObjectId(userID),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiverID",
        foreignField: "_id",
        as: "receiver",
      },
    },
    {
      $lookup: {
        from: "conversations",
        localField: "conversationID",
        foreignField: "_id",
        as: "conversation",
      },
    },
    {
      $addFields: {
        avatarURL: { $arrayElemAt: ["$receiver.avatarURL", 0] },
      },
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
        lastMessageTimestamps: {
          $arrayElemAt: ["$conversation.lastMessageTimestamps", 0],
        },
        userName: { $arrayElemAt: ["$receiver.userName", 0] },
        avatarURL: { $arrayElemAt: ["$receiver.avatarURL", 0] },
        receiverFirstName: { $arrayElemAt: ["$receiver.userFirstName", 0] },
        receiverMiddleName: { $arrayElemAt: ["$receiver.userMiddleName", 0] },
        receiverLastName: { $arrayElemAt: ["$receiver.userLastName", 0] },
        verified: { $arrayElemAt: ["$receiver.verified", 0] },
      },
    },
  ]);

  res.status(200).json(conversations);
});

module.exports = readConversationList;
