/** @format */

const {
  Notifications,
  UnseenNotifications,
} = require("../../../models/notificationModel");
const {
  Posts,
  Replies,
  Reposts,
  Likes,
} = require("../../../models/postsModel");
const { ActiveUsers, Users, Following } = require("../../../models/userModel");

const createNewNotifications = async (data, socket, io) => {
  const { actionType, actionID, postID, postType, actorID, targetID } = data;

  let postExists;
  let ownership;

  switch (actionType) {
    case "reply":
      postExists = await Replies.findById(actionID);
      if (postExists && postExists.parentAuthorID.toString() !== actorID) {
        ownership = false;
      } else {
        ownership = true;
      }
      break;
    case "like":
      postExists = await Likes.findById(actionID);
      if (postExists && postExists.parentAuthorID.toString() !== actorID) {
        ownership = false;
      } else {
        ownership = true;
      }
      break;
    case "repost":
      postExists = await Reposts.findById(actionID);
      if (postExists && postExists.parentAuthorID.toString() !== actorID) {
        ownership = false;
      } else {
        ownership = true;
      }
      break;
    case "follow":
      postExists = await Following.findById(actionID);
      if (postExists && postExists.followerID.toString() !== actorID) {
        ownership = false;
      } else {
        ownership = true;
      }
      break;
    default:
      return;
  }

  if (ownership === false) {
    const newNotification = await Notifications.create({
      actionType: actionType,
      postID: postID,
      actionID: postExists._id,
      postType: postType,
      actorID: actorID,
      targetID: targetID,
      seen: false,
    });

    if (newNotification) {
      const isTargetActive = await ActiveUsers.findOne({
        userID: newNotification.targetID,
      });

      const targetNotifications = await Notifications.aggregate([
        {
          $match: {
            _id: newNotification._id,
            targetID: newNotification.targetID,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "actorID",
            foreignField: "_id",
            as: "actor",
          },
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            actionType: 1,
            actorID: 1,
            actionID: 1,
            targetID: 1,
            postID: 1,
            postType: 1,
            seen: 1,
            actorUserName: { $arrayElemAt: ["$actor.userName", 0] },
            actorAvatarURL: { $arrayElemAt: ["$actor.avatarURL", 0] },
          },
        },
        {
          $limit: 1,
        },
      ]);

      if (isTargetActive) {
        io.to(isTargetActive.socketID).emit(
          "newNotification",
          targetNotifications[0]
        );
      }
    }
  }
};

module.exports = createNewNotifications;
