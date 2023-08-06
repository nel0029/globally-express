/** @format */

const {
  Notifications,
  UnseenNotifications,
} = require("../../../models/notificationModel");
const { Replies } = require("../../../models/postsModel");
const { ActiveUsers } = require("../../../models/userModel");

const deleteReply = async (data, socket, io) => {
  const { actionID, actorID, targetID } = data;

  const replyExists = await Replies.findById(actionID);

  if (replyExists) {
    const deletedNotification = await Notifications.findOneAndDelete({
      actionID: replyExists._id,
      actorID: actorID,
    });

    if (deletedNotification) {
      const unseenNotifications = await UnseenNotifications.findOne({
        targetID: targetID,
      });

      if (unseenNotifications) {
        if (unseenNotifications.unseenNotificationsCount !== 0) {
          unseenNotifications.unseenNotificationsCount = -1;
          await unseenNotifications.save();
        } else {
          unseenNotifications.unseenNotificationsCount = 0;
          await unseenNotifications.save();
        }

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
    }
  }
};

module.exports = deleteReply;
