/** @format */

const { ObjectId } = require("mongodb");
const {
  Messages,
  Conversations,
  ConversationMembers,
  UnseenMessagesCount,
} = require("../../../models/messageModel");
const { ActiveUsers } = require("../../../models/userModel");

const createNewMessage = async (data, socket, io) => {
  const { senderID, receiverID, text } = data;

  const conversationSenderExist = await ConversationMembers.findOne({
    senderID: senderID,
    receiverID: receiverID,
  });
  // const receiverUnseenMessagesCount = await UnseenMessagesCount.findOne({ targetID: receiverID })

  if (!conversationSenderExist) {
    const newConversation = await Conversations.create({
      type: "private",
    });

    if (newConversation) {
      const newSenderConversationMember = await ConversationMembers.create({
        conversationID: newConversation._id,
        senderID: senderID,
        receiverID: receiverID,
      });

      const newReceiverConversationMember = await ConversationMembers.create({
        conversationID: newConversation._id,
        senderID: receiverID,
        receiverID: senderID,
      });

      const newMessage = await Messages.create({
        conversationID: newConversation._id,
        senderID: senderID,
        text: text,
      });

      newConversation.lastMessage = newMessage.text;
      newConversation.lastMessageID = newMessage._id;
      newConversation.lastMessageTimestamps = newMessage.createdAt;

      newReceiverConversationMember.unseenMessagesCount = +1;

      await newConversation.save();
      await newReceiverConversationMember.save();

      const senderNewConvo = await ConversationMembers.aggregate([
        {
          $match: {
            senderID: newSenderConversationMember.senderID,
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
            receiver: {
              $arrayElemAt: ["$receiver", 0],
            },
            conversation: {
              $arrayElemAt: ["$conversation", 0],
            },
          },
        },
        {
          $project: {
            _id: 1,
            conversationID: 1,
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
            lastMessageTimestamps: "$conversation.lastMessageTimestamps",
          },
        },
      ]);

      const forSender = {
        conversation: senderNewConvo[0],
        message: newMessage,
      };

      const sender = await ActiveUsers.findOne({ userID: senderID });

      const isReceiverActive = await ActiveUsers.findOne({
        userID: newSenderConversationMember.receiverID,
      });

      const unseenMessages = await ConversationMembers.aggregate([
        {
          $match: {
            recieverID: newSenderConversationMember.receiverID,
          },
        },
        {
          $group: {
            _id: null,
            unseenMessagesCount: {
              $sum: "$unseenMessagesCount",
            },
          },
        },
      ]);

      if (isReceiverActive) {
        const receiverNewConvo = await ConversationMembers.aggregate([
          {
            $match: {
              senderID: newReceiverConversationMember.senderID,
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
            $addFields: {
              receiver: {
                $arrayElemAt: ["$receiver", 0],
              },
              conversation: {
                $arrayElemAt: ["$conversation", 0],
              },
            },
          },
          {
            $project: {
              _id: 1,
              conversationID: 1,
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
              lastMessageTimestamps: "$conversation.lastMessageTimestamps",
            },
          },
        ]);

        io.to(isReceiverActive.socketID).emit(
          "newMessageCount",
          unseenMessages[0]
        );
        io.to(isReceiverActive.socketID).emit(
          "receiveNewMessages",
          receiverNewConvo[0]
        );
        io.to(sender.socketID).emit("createNewMessage", forSender);
      } else {
        io.to(sender.socketID).emit("createNewMessage", forSender);
      }
    }
  }
};

module.exports = createNewMessage;
