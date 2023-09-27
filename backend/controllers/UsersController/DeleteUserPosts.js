/** @format */

const asyncHandler = require("express-async-handler");
const { Users } = require("../../models/userModel");
const {
  Posts,
  Replies,
  Reposts,
  Hashtags,
  PollOptions,
  PollRespondents,
} = require("../../models/postsModel");
const cloudinary = require("../../utils/cloudinary");

const deleteUserPosts = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  const { adminID } = req.query;

  const userExists = await Users.findOne({ userName: userName });
  const adminExists = await Users.findById(adminID);

  if (adminExists && adminExists.role === "admin") {
    if (userExists) {
      const allPosts = await Posts.find({ authorID: userExists._id });
      const allReposts = await Reposts.find({ authorID: userExists._id });
      const allReplies = await Replies.find({ authorID: userExists._id });

      const withMediaPosts = allPosts.filter(
        (post) => post.mediaURL.length > 0
      );

      const withMediaReposts = allReposts.filter(
        (post) => post.mediaURL.length > 0
      );

      const withMediaReplies = allReplies.filter(
        (reply) => reply.mediaURL.length > 0
      );

      if (withMediaPosts && withMediaPosts.length > 0) {
        for (const post in withMediaPosts) {
          for (const media in post.mediaURL) {
            await cloudinary.uploader.destroy(media.id);
          }

          await Hashtags.deleteMany({ postID: post._id });
          await PollOptions.deleteMany({ postID: post._id });
          await PollRespondents.deleteMany({ postID: post._id });
        }
      }

      if (withMediaReplies && withMediaReplies.length > 0) {
        for (const reply in withMediaReplies) {
          for (const media in reply.mediaURL) {
            await cloudinary.uploader.destroy(media.id);
          }

          await Hashtags.deleteMany({ postID: reply._id });
        }
      }

      if (withMediaReposts && withMediaReposts.length > 0) {
        for (const repost in withMediaReposts) {
          for (const media in repost.mediaURL) {
            await cloudinary.uploader.destroy(media.id);
          }
          await Hashtags.deleteMany({ postID: repost._id });
        }
      }

      await Posts.deleteMany({ authorID: userExists._id });
      await Replies.deleteMany({ authorID: userExists._id });
      await Reposts.deleteMany({ authorID: userExists._id });

      res.status(200).json({ userID: userExists._id });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res.status(400).json({ message: "Request not allowed" });
  }
});

module.exports = deleteUserPosts;
