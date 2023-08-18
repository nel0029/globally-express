/** @format */

const { ObjectId } = require("mongodb");
const { Types } = require("mongoose");
const { Posts, Likes, Replies, Reposts } = require("../../models/postsModel");
const { Users, Following } = require("../../models/userModel");
const asyncHandler = require("express-async-handler");

const basePath = process.env.BASE_PATH;

const readAllRepliesByUser = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  const { authorID } = req.query;

  const author = await Users.findOne({ userName: userName }).lean().exec();

  if (author) {
    const replies = await Replies.aggregate([
      {
        $match: {
          authorID: author._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorID",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "parentAuthorID",
          foreignField: "_id",
          as: "parentAuthor",
        },
      },
      {
        $lookup: {
          from: "replies",
          localField: "_id",
          foreignField: "parentPostID",
          as: "replies",
        },
      },
      {
        $lookup: {
          from: "reposts",
          localField: "_id",
          foreignField: "parentPostID",
          as: "reposts",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "parentPostID",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "followings",
          localField: "authorID",
          foreignField: "followingID",
          as: "followers",
        },
      },
      {
        $addFields: {
          postAuthorFirstName: { $arrayElemAt: ["$author.userFirstName", 0] },
          postAuthorMiddleName: { $arrayElemAt: ["$author.userMiddleName", 0] },
          postAuthorLastName: { $arrayElemAt: ["$author.userLastName", 0] },
          postAuthorUserName: { $arrayElemAt: ["$author.userName", 0] },
          postAuthorAvatarURL: { $arrayElemAt: ["$author.avatarURL", 0] },
          verified: { $arrayElemAt: ["$author.verified", 0] },
          parentUserName: { $arrayElemAt: ["$parentAuthor.userName", 0] },
          parentAvatarURL: { $arrayElemAt: ["$parentAuthor.avatarURL", 0] },
          likesCount: { $size: "$likes" },
          repliesCount: { $size: "$replies" },
          repostCount: { $size: "$reposts" },
          isLiked: {
            $cond: [
              { $in: [new ObjectId(authorID), "$likes.authorID"] },
              true,
              false,
            ],
          },
          likeID: {
            $ifNull: [
              {
                $let: {
                  vars: {
                    filteredLikes: {
                      $filter: {
                        input: "$likes",
                        cond: {
                          $eq: ["$$this.authorID", new ObjectId(authorID)],
                        },
                      },
                    },
                  },
                  in: { $arrayElemAt: ["$$filteredLikes._id", 0] },
                },
              },
              null,
            ],
          },
          isFollowedAuthor: {
            $in: [new ObjectId(authorID), "$followers.followerID"],
          },
          followedID: {
            $ifNull: [
              {
                $let: {
                  vars: {
                    filteredFollowers: {
                      $filter: {
                        input: "$followers",
                        cond: {
                          $eq: ["$$this.authorID", new ObjectId(authorID)],
                        },
                      },
                    },
                  },
                  in: { $arrayElemAt: ["$$filteredFollowers._id", 0] },
                },
              },
              null,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          caption: 1,
          mediaURL: 1,
          type: 1,
          createdAt: 1,
          authorID: 1,
          verified: 1,
          // Include other necessary fields from the posts collection
          postAuthorFirstName: 1,
          postAuthorMiddleName: 1,
          postAuthorLastName: 1,
          postAuthorUserName: 1,
          postAuthorAvatarURL: 1,
          parentAvatarURL: 1,
          parentUserName: 1,
          parentPostID: 1,
          likesCount: 1,
          repliesCount: 1,
          repostsCount: 1,
          isLiked: 1,
          likeID: 1,
          isFollowedAuthor: 1,
          followedID: 1,
          // Include other necessary fields extracted from other collections
        },
      },
    ]);

    res.status(200).json(replies);
  } else {
    res
      .status(404)
      .json({
        message: `This user who has a userName: ${userName} did not exists`,
      });
  }
});

module.exports = readAllRepliesByUser;
