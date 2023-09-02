/** @format */

const { Users } = require("../../models/userModel");
const { Reposts, Hashtags } = require("../../models/postsModel");
const asyncHandler = require("express-async-handler");

const updateRepost = asyncHandler(async (req, res) => {
  const { authorID, _id, caption } = req.body;
  const userExists = await Users.findById(authorID);
  console.log(_id);
  if (userExists) {
    const repostExists = await Reposts.findById(_id);
    if (repostExists) {
      if (repostExists.authorID.toString() === String(userExists._id)) {
        repostExists.caption = caption;

        if (caption) {
          const hashtagRegex = /#[A-Za-z0-9]+/g;

          const matches = caption.match(hashtagRegex);
          const hashtags = matches ? matches : [];

          const hashtagPromises = hashtags.map(async (hashtag) => {
            const newHashtag = new Hashtags({
              name: hashtag,
              postID: repostExists._id,
              postType: repostExists.type,
            });
            await newHashtag.save();
          });

          await Promise.all(hashtagPromises);
        }
        await repostExists.save();

        res.status(202).json(repostExists);
      } else {
        res.status(401).json({ message: "Unauthorized request" });
      }
    } else {
      res.status(404).json({ message: "Repost not found" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = updateRepost;
