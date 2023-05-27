const { Users } = require('../../models/userModel')
const { Posts, Replies, Reposts } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')

const createNewLike = asyncHandler(async () => {

    const { userID, postID, parentType } = req.body

    const userExists = await Users.findById(userID)

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

        const likeExists = await Likes.findOne({
            userID: userExists._id,
            parentID: parentExists._id,
            parentType: parentExists.type,
            type: 'like',
        });

        if (likeExists) {
            res.status(400).json({ message: "You already like this post" })
        } else {
            if (parentExists) {
                const newLike = new Likes({
                    userID: userExists._id,
                    parentID: parentExists._id,
                    parentType: parentExists.type,
                    type: 'like',
                });

                await newLike.save();

                await parentExists.updateOne({ $inc: { [countField]: 1 } });
                const reponseLike = {
                    _id: newLike._id.toString(),
                    userID: newLike.userID,
                    parentID: newLike.parentID,
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

module.exports = {
    createNewLike
}