/** @format */

const { Posts, Replies, Reposts, Likes } = require("../../models/postsModel");
const { Users } = require("../../models/userModel");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../../utils/cloudinary");

const deleteReply = asyncHandler(async (req, res) => {
  const { authorID, postID } = req.query;

  const userExists = await Users.findById(authorID);

  if (userExists) {
    const replyExists = await Replies.findById(postID);

    if (replyExists) {
      if (replyExists.authorID.toString() === authorID) {
        await Promise.all(
          replyExists.mediaURL.map(async (photoPath) => {
            await cloudinary.uploader.destroy(photoPath._id);
          })
        );

        await Promise.all([Replies.findByIdAndDelete(replyExists._id)]);

        switch (replyExists.parentType) {
          case "post":
            await Posts.findByIdAndUpdate(replyExists.parentID, {
              $inc: { repliesCount: -1 },
            });

            break;

          case "reply":
            await Replies.findByIdAndUpdate(replyExists.parentID, {
              $inc: { repliesCount: -1 },
            });

            break;
          case "repost":
            await Reposts.findByIdAndUpdate(replyExists.parentID, {
              $inc: { repliesCount: -1 },
            });

            break;
          default:
            res.status(400).json({ message: "Invalid Parent Type" });
        }

        res.status(202).json({
          postID: replyExists._id,
          parentPostID: replyExists.parentPostID,
        });
      } else {
        res.status(401).json({ message: "Unauthorized request" });
      }
    } else {
      res.status(404).json({ message: "Reply not found" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = deleteReply;
