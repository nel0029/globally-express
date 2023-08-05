/** @format */

const {
  Conversations,
  ConversationMembers,
} = require("../../../models/messageModel");

const leaveConversation = async (data, socket, io) => {
  const { conversationID, memberID } = data;
  const conversationExists = await Conversations.findById(conversationID);
  if (conversationExists) {
    const memberExists = await ConversationMembers.findOne({
      conversationID: conversationExists._id,
      memberID: memberID,
    });

    if (memberExists) {
      socket.leave(memberExists.conversationID);
    }
  }
};

module.exports = leaveConversation;
