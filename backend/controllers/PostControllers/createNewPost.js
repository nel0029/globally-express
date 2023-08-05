/** @format */

const { Users } = require("../../models/userModel");
const { Posts, PollOptions } = require("../../models/postsModel");
const asyncHandler = require("express-async-handler");

const createNewPost = asyncHandler(async (req, res) => {
  const { authorID, caption, hasPoll, pollOptions, mediaURLs, bgColor } =
    req.body;

  const userExists = await Users.findById(authorID);

  if (userExists) {
    const newPost = new Posts({
      authorID: userExists._id,
      type: "post",
      caption: caption,
      mediaURL: mediaURLs,
      hasPoll: hasPoll,
      bgColor: bgColor,
    });

    const savedPost = await newPost.save();

    if (newPost.hasPoll) {
      const pollOptionPromises = pollOptions.map((option) => {
        const newPollOption = new PollOptions({
          postID: savedPost._id,
          body: option,
        });
        return newPollOption.save();
      });

      await Promise.all(pollOptionPromises);

      const pollOptionsList = await PollOptions.find({
        postID: savedPost._id,
      }).select("_id body");
      const formattedPollOptions = pollOptionsList.map(({ _id, body }) => ({
        _id,
        body,
        count: 0,
      }));

      const responseWithPoll = {
        _id: newPost._id,
        authorID: newPost.authorID,
        type: newPost.type,
        caption: newPost.caption,
        mediaURL: newPost.mediaURL,
        likesCount: 0,
        repliesCount: 0,
        repostsCount: 0,
        postAuthorFirstName: userExists.userFirstName,
        postAuthorMiddleName: userExists.userMiddleName,
        postAuthorLastName: userExists.userLastName,
        postAuthorUserName: userExists.userName,
        postAuthorAvatarURL: userExists.avatarURL,
        createdAt: newPost.createdAt,
        hasPoll: savedPost.hasPoll,
        pollOptions: formattedPollOptions,
        pollRespondentsCount: 0,
      };

      res.status(201).json(responseWithPoll);
    } else {
      const response = {
        _id: newPost._id,
        authorID: newPost.authorID,
        type: newPost.type,
        caption: newPost.caption,
        mediaURL: mediaURLs,
        bgColor: newPost.bgColor,
        likesCount: 0,
        repliesCount: 0,
        repostsCount: 0,
        postAuthorFirstName: userExists.userFirstName,
        postAuthorMiddleName: userExists.userMiddleName,
        postAuthorLastName: userExists.userLastName,
        postAuthorUserName: userExists.userName,
        postAuthorAvatarURL: userExists.avatarURL,
        createdAt: savedPost.createdAt,
        hasPoll: savedPost.hasPoll,
      };

      res.status(201).json(response);
    }
  } else {
    res.status(404).json({ message: "User not found." });
  }
});

module.exports = createNewPost;
