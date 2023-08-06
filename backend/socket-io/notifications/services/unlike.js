/** @format */

const {
  Notifications,
  UnseenNotifications,
} = require("../../../models/notificationModel");
const { Likes } = require("../../../models/postsModel");
const { ActiveUsers } = require("../../../models/userModel");

const unlike = async (data, socket, io) => {
  const { actionID, actorID, targetID } = data;

  const likeExists = await Likes.findById(actionID);

  if (likeExists) {
    const deletedNotification = await Notifications.findOneAndDelete({
      actionID: likeExists._id,
      actorID: actorID,
    });
    const unseenNotifications = await UnseenNotifications.findOne({
      targetID: targetID,
    });

    if (unseenNotifications.unseenNotificationsCount !== 0) {
      unseenNotifications.unseenNotificationsCount = -1;
    } else {
      unseenNotifications.unseenNotificationsCount = 0;
    }

    await unseenNotifications.save();

    const isTargetActive = await ActiveUsers.findOne({
      userID: unseenNotifications.targetID,
    });

    const updatedNotification = {
      notification: deletedNotification,
      unseenNotification: unseenNotifications,
    };

    if (isTargetActive) {
      io.to(isTargetActive.socketID).emit(
        "removeNotification",
        updatedNotification
      );
    }
  }
};

module.exports = unlike;
