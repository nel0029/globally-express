/** @format */

const asyncHandler = require("express-async-handler");
const { Users, Following } = require("../../models/userModel");
const { ObjectId } = require("mongodb");

const basePath = process.env.BASE_PATH;

const ReadUserDetails = asyncHandler(async (req, res) => {
  const { userName } = req.params; //User that us being request to check
  const { authorID } = req.query; // User who made the request

  const userExist = await Users.findOne({ userName: userName });

  if (userExist) {
    const users = await Users.aggregate([
      {
        $match: {
          _id: userExist._id,
        },
      },
      {
        $lookup: {
          from: "followings",
          localField: "_id",
          foreignField: "followingID",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "followings",
          localField: "_id",
          foreignField: "followerID",
          as: "followings",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "authorID",
          as: "posts",
        },
      },
      {
        $addFields: {
          followersCount: { $size: "$followers" },
          followingsCount: { $size: "$followings" },
          isFollowedUser: {
            $cond: [
              { $in: [new ObjectId(authorID), "$followers.followerID"] },
              true,
              false,
            ],
          },
          followID: { $arrayElemAt: ["$followers._id", 0] },
          isYourFollower: {
            $cond: [
              { $in: [new ObjectId(authorID), "$followings.followingID"] },
              true,
              false,
            ],
          },
          allPostsCount: { $size: "$posts" },
        },
      },
      {
        $project: {
          _id: 1,
          userFirstName: 1,
          userMiddleName: 1,
          userLastName: 1,
          userName: 1,
          avatarURL: 1,
          verified: 1,
          coverPhotoURL: 1,
          bio: 1,
          followID: 1,
          followingsCount: 1,
          followersCount: 1,
          isFollowedUser: 1,
          isYourFollower: 1,
          allPostsCount: 1,
        },
      },
    ]);

    const user = users[0];

    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not exists" });
  }
});

module.exports = ReadUserDetails;
