const { Posts, Replies, Reposts, Likes } = require('../../models/postsModel')
const { Users } = require('../../models/userModel')
const asyncHandler = require('express-async-handler')

const deletePost = asyncHandler(async (req, res) => {
    const { authorID, postID } = req.query

    const userExists = await Users.findById(authorID)

    if (userExists) {
        const postExists = await Posts.findById(postID)

        if (postExists) {
            if (postExists.authorID.toString() === authorID) {

                await Promise.all([
                    Posts.findByIdAndDelete(postExists._id),
                    Replies.deleteMany({ parentID: postExists._id }),
                    Reposts.deleteMany({ parentID: postExists._id }),
                    Likes.deleteMany({ parentID: postExists._id }),
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
