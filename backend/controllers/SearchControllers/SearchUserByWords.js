/** @format */

const asyncHandler = require("express-async-handler");
const { Posts, Replies, Reposts } = require("../../models/postsModel");
const { Users } = require("../../models/userModel");
const { ObjectId } = require("mongodb");

const searchUsersByWords = asyncHandler(async (req, res) => {
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
    ]);

    res.status(200).json(matchedUsers);
  }
});

module.exports = searchUsersByWords;
