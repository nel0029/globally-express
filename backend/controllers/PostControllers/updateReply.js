/** @format */

const { Users } = require("../../models/userModel");
const { Replies } = require("../../models/postsModel");
const asyncHandler = require("express-async-handler");

const updateReply = asyncHandler(async (req, res) => {
  const { authorID, _id, caption } = req.body;
  const userExists = await Users.findById(authorID);

  if (userExists) {
    const replyExists = await Replies.findById(_id);

    if (replyExists) {
      if (String(replyExists.authorID) === String(userExists._id)) {
        replyExists.caption = caption;
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
