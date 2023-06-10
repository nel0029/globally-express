const { Posts, Replies, Reposts, Likes } = require('../../models/postsModel')
const { Users } = require('../../models/userModel')
const asyncHandler = require('express-async-handler')

const deleteRepost = asyncHandler(async (req, res) => {
    const { authorID, postID } = req.query

    const userExists = await Users.findById(authorID)

    if (userExists) {
        const repostExists = await Reposts.findById(postID)

        if (repostExists) {
            if (repostExists.authorID.toString() === authorID) {

                await Promise.all([
                    Reposts.findByIdAndDelete(repostExists._id),
                    Replies.deleteMany({ parentID: repostExists._id }),
                    Reposts.deleteMany({ parentID: repostExists._id }),
                    Likes.deleteMany({ parentID: repostExists._id }),
                ]);

                switch (repostExists.parentType) {
                    case 'post':
                        await Posts.findByIdAndUpdate(repostExists.parentID, {
                            $inc: { repostsCount: -1 }
                        })
                        break

                    case 'reply':
                        await Replies.findByIdAndUpdate(repostExists.parentID, {
                            $inc: { repostsCount: -1 }
                        })
                        break

                    case 'repost':
                        await Reposts.findByIdAndUpdate(repostExists.parentID, {
                            $inc: { repostsCount: -1 }
                        })
                        break

                    default:
                        res.status(400).json({ message: "Invalid Parent Type" })
                }

                res.status(202).json({
                    postID: repostExists._id,
                    parentID: repostExists.parentID
                });
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

module.exports = deleteRepost
