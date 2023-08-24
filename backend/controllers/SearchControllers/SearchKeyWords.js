/** @format */

const asyncHandler = require("express-async-handler");
const { SearchedWords } = require("../../models/postsModel");
const { Users } = require("../../models/userModel");

const searchKeyWords = asyncHandler(async (req, res) => {
  const { query, userID } = req.query;

  const userExists = await Users.findById(userID);

  if (userExists) {
    if (query) {
      const queryLines = query.split("\n").map((word) => word.trim());
      const queryWords = queryLines
        .map((line) => line.split(" ").map((word) => word.trim()))
        .flat();

      const escapeSpecialCharacters = (input) => {
        if (Array.isArray(input)) {
          return input.map((str) =>
            str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/[#@]/g, "$&")
          );
        } else if (typeof input === "string") {
          return input
            .replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
            .replace(/[#@]/g, "$&");
        }
        return input; // Return input as-is if not an array or string
      };

      const escapedQueryWords = queryWords.map(escapeSpecialCharacters);

      const queryWordsRegex = escapedQueryWords.map(
        (word) => new RegExp(word, "i")
      );

      const matchedKeyWords = await SearchedWords.aggregate([
        {
          $match: {
            name: { $in: queryWordsRegex },
          },
        },
        {
          $group: {
            _id: "$name",
            searchCounts: { $sum: 1 },
          },
        },
        {
          $addFields: {
            score: {
              $sum: {
                $map: {
                  input: queryWords,
                  as: "word",
                  in: {
                    $cond: [{ $eq: ["$_id", "$$word"] }, 1, 0],
                  },
                },
              },
            },
          },
        },
        {
          $sort: {
            score: -1,
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            searchCounts: 1,
            score: 1,
          },
        },
        {
          $limit: 10,
        },
      ]);

      res.status(200).json(matchedKeyWords);
    }
  }
});

module.exports = searchKeyWords;
