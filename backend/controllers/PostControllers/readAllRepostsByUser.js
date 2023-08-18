/** @format */

const { ObjectId } = require("mongodb");
const { Types } = require("mongoose");
const { Posts, Likes, Replies, Reposts } = require("../../models/postsModel");
const { Users, Following } = require("../../models/userModel");
const asyncHandler = require("express-async-handler");

const basePath = process.env.BASE_PATH;

const readAllRepostsByUser = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  const { authorID } = req.query;

  const author = await Users.findOne({ userName: userName }).lean().exec();

  if (author) {
    const reposts = await Reposts.aggregate([
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
          from: "posts",
          localField: "parentPostID",
          foreignField: "_id",
          as: "parentPost",
        },
      },
      {
        $lookup: {
          from: "replies",
          localField: "parentPostID",
          foreignField: "_id",
          as: "parentReply",
        },
      },
      {
        $lookup: {
          from: "reposts",
          localField: "parentPostID",
          foreignField: "_id",
          as: "parentRepost",
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
          localField: "parentPostID",
          foreignField: "postID",
          as: "pollOptions",
        },
      },
      {
        $lookup: {
          from: "pollrespondents",
          localField: "parentPostID",
          foreignField: "postID",
          as: "pollRespondents",
        },
      },

      {
        $lookup: {
          from: "pollrespondents",
          localField: "parentPostID",
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
          parentUserName: { $arrayElemAt: ["$parentAuthor.userName", 0] },
          parentAuthorFirstName: {
            $arrayElemAt: ["$parentAuthor.userFirstName", 0],
          },
          parentAuthorMiddleName: {
            $arrayElemAt: ["$parentAuthor.userMiddleName", 0],
          },
          parentAuthorLastName: {
            $arrayElemAt: ["$parentAuthor.userLastName", 0],
          },
          parentAvatarURL: { $arrayElemAt: ["$parentAuthor.avatarURL", 0] },
          parentAuthorVerified: { $arrayElemAt: ["$parentAuthor.verified", 0] },
          parentCaption: {
            $cond: [
              { $eq: ["$parentType", "post"] },
              { $arrayElemAt: ["$parentPost.caption", 0] },
              {
                $cond: [
                  { $eq: ["$parentType", "reply"] },
                  { $arrayElemAt: ["$parentReply.caption", 0] },
                  { $arrayElemAt: ["$parentRepost.caption", 0] }, // Typo corrected from 'parentRepost' to 'paentRepost'
                ],
              },
            ],
          },
          parentMediaURL: {
            $cond: [
              { $eq: ["$parentType", "post"] },
              { $arrayElemAt: ["$parentPost.mediaURL", 0] },
              {
                $cond: [
                  { $eq: ["$parentType", "reply"] },
                  { $arrayElemAt: ["$parentReply.mediaURL", 0] },
                  { $arrayElemAt: ["$parentRepost.mediaURL", 0] }, // Typo corrected from 'parentRepost' to 'paentRepost'
                ],
              },
            ],
          },
          likesCount: { $size: "$likes" },
          repliesCount: { $size: "$replies" },
          repostsCount: { $size: "$reposts" },
          parentBGColor: { $arrayElemAt: ["$parentPost.bgColor", 0] },
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

          parentHasPoll: { $arrayElemAt: ["$parentPost.hasPoll", 0] },
          parentPollRespondentsCount: { $size: "$pollRespondents" },
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
          parentPollOptions: {
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
          parentType: 1,
          verified: 1,
          // Include other necessary fields from the posts collection
          postAuthorFirstName: 1,
          postAuthorMiddleName: 1,
          postAuthorLastName: 1,
          postAuthorUserName: 1,
          postAuthorAvatarURL: 1,

          parentPostID: 1,
          parentUserName: 1,
          parentAuthorFirstName: 1,
          parentAuthorMiddleName: 1,
          parentAuthorLastName: 1,
          parentAvatarURL: 1,
          parentAuthorVerified: 1,
          parentCaption: 1,
          parentMediaURL: 1,
          likesCount: 1,
          repliesCount: 1,
          repostsCount: 1,
          parentBGColor: 1,
          isLiked: 1,
          likeID: 1,
          isFollowedAuthor: 1,
          followedID: 1,

          hasChoosed: 1,
          parentHasPoll: 1,
          parentPollOptions: 1,
          parentPollRespondentsCount: 1,
          optionChoosedID: 1,

          // Include other necessary fields extracted from other collections
        },
      },
    ]);

    res.status(200).json(reposts);
  } else {
    res.status(404).json({
      message: `This user who has a userName: ${userName} did not exists`,
    });
  }
});

module.exports = readAllRepostsByUser;
