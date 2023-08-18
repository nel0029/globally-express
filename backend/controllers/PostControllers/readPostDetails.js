/** @format */

const { Posts, Likes } = require("../../models/postsModel");
const { Types } = require("mongoose");
const { Users, Following } = require("../../models/userModel");
const asyncHandler = require("express-async-handler");
const { MongoClient, ObjectId } = require("mongodb");

const basePath = process.env.BASE_PATH;

const readPostDetails = asyncHandler(async (req, res) => {
  const { userName, postID } = req.params;
  const { authorID } = req.query;
  const newPostID = Types.ObjectId(postID);
  const posts = await Posts.aggregate([
    {
      $match: {
        _id: new ObjectId(postID), // Replace authorID with the desired author's ID
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
      $lookup: {
        from: "polloptions",
        localField: "_id",
        foreignField: "postID",
        as: "pollOptions",
      },
    },
    {
      $lookup: {
        from: "pollrespondents",
        localField: "_id",
        foreignField: "postID",
        as: "pollRespondents",
      },
    },
    {
      $lookup: {
        from: "pollrespondents",
        localField: "_id",
        foreignField: "postID",
        as: "optionRespondents",
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
        likesCount: { $size: "$likes" },
        repliesCount: { $size: "$replies" },
        repostsCount: { $size: "$reposts" },
        pollRespondentsCount: { $size: "$pollRespondents" },
        hasChoosed: {
          $in: [new ObjectId(authorID), "$pollRespondents.respondentID"],
        },
        optionChoosedID: {
          $let: {
            vars: {
              filteredOptions: {
                $filter: {
                  input: "$pollRespondents",
                  cond: {
                    $eq: ["$$this.respondentID", new ObjectId(authorID)],
                  },
                },
              },
            },
            in: { $arrayElemAt: ["$$filteredOptions.optionID", 0] },
          },
        },
        pollOptions: {
          $map: {
            input: "$pollOptions",
            as: "option",
            in: {
              $mergeObjects: [
                "$$option",
                {
                  count: {
                    $size: {
                      $filter: {
                        input: "$optionRespondents",
                        cond: { $eq: ["$$this.optionID", "$$option._id"] },
                      },
                    },
                  },
                },
              ],
            },
          },
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
        postAuthorFirstName: 1,
        postAuthorMiddleName: 1,
        postAuthorLastName: 1,
        postAuthorUserName: 1,
        postAuthorAvatarURL: 1,
        likesCount: 1,
        repliesCount: 1,
        repostsCount: 1,
        bgColor: 1,
        isLiked: {
          $in: [new ObjectId(authorID), "$likes.authorID"],
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
        hasPoll: { $gt: [{ $size: "$pollOptions" }, 0] },
        pollRespondentsCount: 1,
        pollOptions: 1,
        hasChoosed: 1,
        optionChoosedID: 1,
      },
    },
  ]);

  const post = posts[0];
  res.status(200).json(post);
});

module.exports = readPostDetails;
