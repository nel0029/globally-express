/** @format */

const { Notifications } = require("../../../models/notificationModel");
const { Likes, Replies, Reposts } = require("../../../models/postsModel");
const { ActiveUsers, Users } = require("../../../models/userModel");

const deleteNotification = async (data, socket, io) => {
  const { actionID, actorID, targetID } = data;

  const deletedNotification = await Notifications.findOneAndDelete({
    actionID: actionID,
    actorID: actorID,
    targetID: targetID,
  });

  const isTargetActive = await ActiveUsers.findOne({ userID: targetID });

  if (isTargetActive) {
    io.to(isTargetActive.socketID).emit(
      "deleteNotification",
      deletedNotification
    );
  }
};

module.exports = deleteNotification;
