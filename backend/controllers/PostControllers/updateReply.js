/** @format */

const { Users } = require("../../models/userModel");
const { Replies, Hashtags } = require("../../models/postsModel");
const asyncHandler = require("express-async-handler");

const updateReply = asyncHandler(async (req, res) => {
  const { authorID, _id, caption } = req.body;
  const userExists = await Users.findById(authorID);

  if (userExists) {
    const replyExists = await Replies.findById(_id);

    if (replyExists) {
      if (String(replyExists.authorID) === String(userExists._id)) {
        replyExists.caption = caption;

        if (caption) {
          const hashtagRegex = /#[A-Za-z0-9]+/g;

          const matches = caption.match(hashtagRegex);
          const hashtags = matches ? matches : [];

          const hashtagPromises = hashtags.map(async (hashtag) => {
            const newHashtag = new Hashtags({
              name: hashtag,
              postID: replyExists._id,
              postType: replyExists.type,
            });
            await newHashtag.save();
          });

          await Promise.all(hashtagPromises);
        }
        await replyExists.save();

        res.status(202).json(replyExists);
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

module.exports = updateReply;
