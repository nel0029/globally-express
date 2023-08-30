/** @format */

const { Notifications } = require("../../models/notificationModel");
const { Users } = require("../../models/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const updateNotification = asyncHandler(async (req, res) => {
  const { notificationID, userID } = req.body;

  const userExists = await Users.findById(userID);

  if (userExists) {
    const notificationExists = await Notifications.findByIdAndUpdate(
      notificationID,
      { seen: true }
    );

    if (notificationExists) {
      const notification = await Notifications.aggregate([
        {
          $match: {
            _id: new ObjectId(notificationExists._id),
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
        {
          $limit: 1,
        },
      ]);

      res.status(200).json(notification[0]);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = updateNotification;
