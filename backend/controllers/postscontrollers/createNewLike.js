const { Users } = require('../../models/userModel')
const { Posts, Replies, Reposts, Likes } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')

const createNewLike = asyncHandler(async (req, res) => {

    const { authorID, postID, parentType } = req.body

    const userExists = await Users.findById(authorID)
    const likeExist = await Likes.findOne({ $and: [{ parentID: postID }, { authorID: String(userExists._id) }] })

    if (userExists) {

        let parentExists

        switch (parentType) {
            case 'post':
                parentExists = await Posts.findOne({ _id: postID })
                break
            case 'reply':
                parentExists = await Replies.findOne({ _id: postID })
                break
            case 'repost':
                parentExists = await Reposts.findOne({ _id: postID })
                break
            default: res.status(400).json({ message: "Invalid Parent Typpe" })
        }

        const likeExists = await Likes.findOne({ $and: [{ _id: postID }, { authorID: String(userExists._id) }] });

        if (likeExists) {

            res.status(400).json({ message: "You already like this post" })

        } else {

            if (parentExists) {
                const newLike = new Likes({
                    authorID: userExists._id,
                    parentPostID: parentExists._id,
                    parentType: parentExists.type,
                    type: 'like',
                });

                await newLike.save();

                await parentExists.updateOne({ $inc: { likesCount: 1 } });
                const reponseLike = {
                    _id: newLike._id.toString(),
                    postAuthorID: newLike.authorID,
                    parentID: newLike.parentPostID,
                    parentType: newLike.parentType,
                    type: newLike.type
                }
                res.status(201).json(reponseLike)
            } else {
                res.status(404).json({ message: "Post not found" })
            }
        }

    } else {
        res.status(404).json({ message: 'User not found.' });
    }


})

module.exports = createNewLike
