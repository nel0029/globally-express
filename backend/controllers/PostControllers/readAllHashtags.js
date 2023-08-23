/** @format */

const { Hashtags } = require("../../models/postsModel");
const asyncHandler = require("express-async-handler");

const readAllHashtags = asyncHandler(async (req, res) => {
  const hashtagCounts = await Hashtags.aggregate([
    {
      $group: {
        _id: "$name",
        postIDs: { $addToSet: "$postID" },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        postsCount: { $size: "$postIDs" },
      },
    },
    {
      $sort: { postCount: 1 },
    },
    {
      $limit: 10,
    },
  ]);

  res.status(200).json(hashtagCounts);
});

module.exports = readAllHashtags;
