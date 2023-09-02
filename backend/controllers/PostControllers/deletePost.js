/** @format */

const {
  Posts,
  PollOptions,
  PollRespondents,
  Hashtags,
} = require("../../models/postsModel");
const { Users } = require("../../models/userModel");
const { Notifications } = require("../../models/notificationModel");
const asyncHandler = require("express-async-handler");

const cloudinary = require("../../utils/cloudinary");

const deletePost = asyncHandler(async (req, res) => {
  const { authorID, postID } = req.query;

  const userExists = await Users.findById(authorID);

  if (userExists) {
    const postExists = await Posts.findById(postID);

    if (postExists) {
      if (postExists.authorID.toString() === authorID) {
        await Promise.all(
          postExists.mediaURL.map(async (photoPath) => {
            await cloudinary.uploader.destroy(photoPath.id);
          })
        );

        await Promise.all([
          Posts.findByIdAndDelete(postExists._id),
          PollOptions.deleteMany({ postID: postExists._id }),
          PollRespondents.deleteMany({ postID: postExists._id }),
          Hashtags.deleteMany({ postID: postExists._id }),
          Notifications.deleteMany({
            postID: postExists._id,
            targetID: postExists.authorID,
          }),
        ]);

        res.status(202).json({ postID: postExists._id });
      } else {
        res.status(401).json({ message: "Unauthorized request" });
      }
    } else {
      console.log("Post Not Found");
      res.status(404).json({ message: "Post not found" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = deletePost;
