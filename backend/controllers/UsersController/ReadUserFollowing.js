/** @format */

const asyncHandler = require("express-async-handler");
const { Users, Following } = require("../../models/userModel");
const { ObjectId } = require("mongodb");

const ReadUserFollowing = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  const { userID } = req.query;

  const userExists = await Users.findOne({ userName: userName });

  if (userExists) {
    const userFollowing = await Following.aggregate([
      {
        $match: {
          followerID: userExists._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followingID",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: "$users",
      },
      {
        $lookup: {
          from: "users",
          localField: "followerID",
          foreignField: "_id",
          as: "userFollower",
        },
      },
      {
        $unwind: "$userFollower",
      },
      {
        $lookup: {
          from: "followings",
          localField: "users._id",
          foreignField: "followingID",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "followings",
          localField: "users._id",
          foreignField: "followerID",
          as: "followings",
        },
      },
      {
        $project: {
          followerID: 1,
          userFollowerUserName: "$userFollower.userName",
          _id: "$users._id",
          userName: "$users.userName",
          userFirstName: "$users.userFirstName",
          userMiddleName: "$users.userMiddleName",
          userLastName: "$users.userLastName",
          avatarURL: "$users.avatarURL",
          verified: "$users.verified",
          coverPhotoURL: "$users.coverPhotoURL",
          bio: "$users.bio",
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$followings" },
          isUserFollowed: {
            $in: [new ObjectId(userID), "$followers.followerID"],
          },
          followID: {
            $let: {
              vars: {
                matchedFollowers: {
                  $filter: {
                    input: "$followers",
                    as: "follower",
                    cond: {
                      $eq: ["$$follower.followerID", new ObjectId(userID)],
                    },
                  },
                },
              },
              in: { $arrayElemAt: ["$$matchedFollowers._id", 0] },
            },
          },
        },
      },
    ]);

    res.status(200).json(userFollowing);
  } else {
    res.status(404).json({ message: "User Not Found" });
  }
});

module.exports = ReadUserFollowing;
