/** @format */

const asyncHandler = require("express-async-handler");
const {
  Posts,
  Replies,
  Reposts,
  SearchedWords,
} = require("../../models/postsModel");
const { Users } = require("../../models/userModel");
const { ObjectId } = require("mongodb");

const searchWords = asyncHandler(async (req, res) => {
  const { query, userID } = req.query;

  const userExists = await Users.findById(userID);

  if (userExists) {
    const queryLines = query.split("\n").map((word) => word.trim());
    const queryWords = queryLines
      .map((line) => line.split(" ").map((word) => word.trim()))
      .flat();

    const escapeSpecialCharacters = (input) => {
      if (Array.isArray(input)) {
        return input.map((str) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"));
      } else if (typeof input === "string") {
        return input.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      return input; // Return input as-is if not an array or string
    };

    const escapedQueryWords = queryWords.map(escapeSpecialCharacters);

    const queryWordsRegex = escapedQueryWords.map(
      (word) => new RegExp(word, "i")
    );

    const matchedPosts = await Posts.aggregate([
      {
        $match: {
          caption: { $in: queryWordsRegex },
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
          isLiked: {
            $cond: [
              { $in: [new ObjectId(userID), "$likes.authorID"] },
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
                          $eq: ["$$this.authorID", new ObjectId(userID)],
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
            $cond: [
              { $in: [new ObjectId(userID), "$followers.followerID"] },
              true,
              false,
            ],
          },
          followID: {
            $ifNull: [
              {
                $let: {
                  vars: {
                    filteredLikes: {
                      $filter: {
                        input: "$followers",
                        cond: {
                          $eq: ["$$this.followerID", new ObjectId(userID)],
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
          pollRespondentsCount: { $size: "$pollRespondents" },
          hasChoosed: {
            $in: [new ObjectId(userID), "$pollRespondents.respondentID"],
          },
          optionChoosedID: {
            $let: {
              vars: {
                filteredOptions: {
                  $filter: {
                    input: "$pollRespondents",
                    cond: {
                      $eq: ["$$this.respondentID", new ObjectId(userID)],
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
          // Include other necessary fields from the posts collection
          postAuthorFirstName: 1,
          postAuthorMiddleName: 1,
          postAuthorLastName: 1,
          postAuthorUserName: 1,
          postAuthorAvatarURL: 1,
          likesCount: 1,
          repliesCount: 1,
          repostsCount: 1,
          bgColor: 1,
          isLiked: 1,
          likeID: 1,
          isFollowedAuthor: 1,
          followID: 1,
          // Include other necessary fields extracted from other collections
          hasPoll: 1,
          pollOptions: 1,
          pollRespondentsCount: 1,
          hasChoosed: 1,
          optionChoosedID: 1,
        },
      },
      {
        $limit: 3,
      },
    ]);

    const matchedReplies = await Replies.aggregate([
      {
        $match: {
          caption: { $in: queryWordsRegex },
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
          repostsCount: { $size: "$reposts" },
          isLiked: {
            $cond: [
              { $in: [new ObjectId(userID), "$likes.authorID"] },
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
                          $eq: ["$$this.authorID", new ObjectId(userID)],
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
            $in: [new ObjectId(userID), "$followers.followerID"],
          },
          followID: {
            $ifNull: [
              {
                $let: {
                  vars: {
                    filteredFollowers: {
                      $filter: {
                        input: "$followers",
                        cond: {
                          $eq: ["$$this.followerID", new ObjectId(userID)],
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
          parentType: 1,
          likesCount: 1,
          repliesCount: 1,
          repostsCount: 1,
          isLiked: 1,
          likeID: 1,
          isFollowedAuthor: 1,
          followID: 1,
          // Include other necessary fields extracted from other collections
        },
      },
      {
        $limit: 3,
      },
    ]);

    const matchedReposts = await Reposts.aggregate([
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
          localField: "parentPost._id",
          foreignField: "postID",
          as: "pollOptions",
        },
      },
      {
        $lookup: {
          from: "pollrespondents",
          localField: "parentPost._id",
          foreignField: "postID",
          as: "pollRespondents",
        },
      },

      {
        $lookup: {
          from: "pollrespondents",
          localField: "parentPost._id",
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
          parentAuthorVerified: {
            $arrayElemAt: ["$parentAuthor.verified", 0],
          },
          parentCaption: {
            $cond: [
              { $eq: ["$parentType", "post"] },
              { $arrayElemAt: ["$parentPost.caption", 0] },
              {
                $cond: [
                  { $eq: ["$parentType", "reply"] },
                  { $arrayElemAt: ["$parentReply.caption", 0] },
                  { $arrayElemAt: ["$parentRepost.caption", 0] },
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
                  { $arrayElemAt: ["$parentRepost.mediaURL", 0] },
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
              { $in: [new ObjectId(userID), "$likes.authorID"] },
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
                          $eq: ["$$this.authorID", new ObjectId(userID)],
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
            $in: [new ObjectId(userID), "$followers.followerID"],
          },
          followID: {
            $ifNull: [
              {
                $let: {
                  vars: {
                    filteredFollowers: {
                      $filter: {
                        input: "$followers",
                        cond: {
                          $eq: ["$$this.followerID", new ObjectId(userID)],
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
            $in: [new ObjectId(userID), "$pollRespondents.respondentID"],
          },
          optionChoosedID: {
            $let: {
              vars: {
                filteredOptions: {
                  $filter: {
                    input: "$pollRespondents",
                    cond: {
                      $eq: ["$$this.respondentID", new ObjectId(userID)],
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
        $match: {
          $or: [
            { caption: { $in: queryWordsRegex } },
            { parentCaption: { $in: queryWordsRegex } },
          ],
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
          parentAuthorVerified: 1,
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
          parentCaption: 1,
          parentMediaURL: 1,
          likesCount: 1,
          repliesCount: 1,
          repostsCount: 1,
          parentBGColor: 1,
          isLiked: 1,
          likeID: 1,
          isFollowedAuthor: 1,
          followID: 1,
          hasChoosed: 1,
          parentHasPoll: 1,
          parentPollOptions: 1,
          parentPollRespondentsCount: 1,
          optionChoosedID: 1,
          // Include other necessary fields extracted from other collections
        },
      },
      {
        $limit: 3,
      },
    ]);

    const matchedUsers = await Users.aggregate([
      {
        $match: {
          $or: [
            { userName: { $in: queryWordsRegex } },
            { userFirstName: { $in: queryWordsRegex } },
            { userMiddleName: { $in: queryWordsRegex } },
            { userLastName: { $in: queryWordsRegex } },
            { bio: { $in: queryWordsRegex } },
          ],
        },
      },
      {
        $lookup: {
          from: "followings",
          let: { userId: userID },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followerID", "$$userId"] },
                    { $eq: ["$followingID", "$_id"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
          ],
          as: "followInfo",
        },
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          userFirstName: 1,
          userMiddleName: 1,
          userLastName: 1,
          bio: 1,
          avatarURL: 1,
          verified: 1,
          isFollowed: {
            $cond: [{ $gt: [{ $size: "$followInfo" }, 0] }, true, false],
          },
          followID: {
            $cond: [
              { $gt: [{ $size: "$followInfo" }, 0] },
              { $arrayElemAt: ["$followInfo._id", 0] },
              null,
            ],
          },
        },
      },
      {
        $limit: 5,
      },
    ]);

    const allPosts = [...matchedPosts, ...matchedReplies, ...matchedReposts];
    allPosts.sort((a, b) => b.createdAt - a.createdAt);

    const response = {
      matchedUsers: matchedUsers,
      allPosts: allPosts,
    };

    res.status(200).json(response);

    const existingSearch = await SearchedWords.findOne({
      name: query,
      userID: userID,
    });

    if (!existingSearch) {
      await SearchedWords.create({ name: query, userID: userID });
    }
  }
});

module.exports = searchWords;
