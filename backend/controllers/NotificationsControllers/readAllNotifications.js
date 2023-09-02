/** @format */

const { Posts, Replies, Reposts, Likes } = require("../../models/postsModel");
const { Notifications } = require("../../models/notificationModel");
const { Users, Following } = require("../../models/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const readAllNotifications = asyncHandler(async (req, res) => {
  const { userID, markAllAsRead } = req.query;

  const notifications = await Notifications.aggregate([
    {
      $match: {
        targetID: new ObjectId(userID),
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
        actorUserName: { $arrayElemAt: ["$actor.userName", 0] },
        actorAvatarURL: { $arrayElemAt: ["$actor.avatarURL", 0] },
        verified: { $arrayElemAt: ["$actor.verified", 0] },
        seen: 1,
      },
    },
  ]);

  if (markAllAsRead === "true") {
    const notificationIDs = notifications.map(
      (notification) => notification._id
    );

    await Notifications.updateMany(
      { _id: { $in: notificationIDs } },
      { $set: { seen: true } }
    );

    const updatedNotifications = await Notifications.aggregate([
      {
        $match: {
          targetID: new ObjectId(userID),
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
          actorUserName: { $arrayElemAt: ["$actor.userName", 0] },
          actorAvatarURL: { $arrayElemAt: ["$actor.avatarURL", 0] },
          verified: { $arrayElemAt: ["$actor.verified", 0] },
          seen: 1,
        },
      },
    ]);

    res.status(200).json(updatedNotifications);
  } else {
    res.status(200).json(notifications);
  }
});

module.exports = readAllNotifications;
