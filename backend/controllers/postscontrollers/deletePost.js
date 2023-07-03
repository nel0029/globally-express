const { Posts, Replies, Reposts, Likes, Poll, PollOptions, PollRespondents } = require('../../models/postsModel')
const { Users } = require('../../models/userModel')
const asyncHandler = require('express-async-handler')
const fs = require('fs');
const path = require('path');

const cloudinary = require('../../utils/cloudinary')

const deletePost = asyncHandler(async (req, res) => {
    const { authorID, postID } = req.query

    const userExists = await Users.findById(authorID)

    if (userExists) {
        const postExists = await Posts.findById(postID)

        if (postExists) {
            if (postExists.authorID.toString() === authorID) {


                postExists.mediaURL.map(async (photoPath) => {
                    await cloudinary.uploader.destroy(photoPath.id);
                })

                await Promise.all([
                    Posts.findByIdAndDelete(postExists._id),
                    PollOptions.deleteMany({ postID: postExists._id }),
                    PollRespondents.deleteMany({ postID: postExists._id }),
                ]);

                res.status(202).json({ postID: postExists._id });
            } else {
                res.status(401).json({ message: "Unauthorized request" })
            }
        } else {
            res.status(404).json({ message: "Post not found" })
        }
    } else {
        res.status(404).json({ message: "User not found" })
    }

})

module.exports = deletePost
