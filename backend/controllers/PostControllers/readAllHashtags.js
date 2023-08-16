/** @format */

const { Hashtags } = require("../../models/postsModel");
const asyncHandler = require("express-async-handler");

const readAllHashtags = asyncHandler(async (req, res) => {
  const hashtagCounts = await Hashtags.aggregate([
    {
      $group: {
        _id: "$name", // Group by the hashtag name
        postIDs: { $addToSet: "$postID" }, // Collect unique post IDs for each hashtag
      },
    },
    {
      $project: {
        _id: 0, // Exclude the default _id field from the result
        name: "$_id", // Rename _id to name
        postsCount: { $size: "$postIDs" }, // Count the number of unique post IDs
      },
    },
    {
      $sort: { postCount: 1 }, // Sort by postCount in descending order
    },
    {
      $limit: 10, // Limit the result to the top 10 hashtags
    },
  ]);

  res.status(200).json(hashtagCounts);
});

module.exports = readAllHashtags;
