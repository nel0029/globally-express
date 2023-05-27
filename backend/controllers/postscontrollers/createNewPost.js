const { Users } = require('../../models/userModel')
const { Posts } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')


const createNewPost = asyncHandler(async (req, res) => {

    const { userID, caption, mediaURL } = req.body

    const userExists = await Users.findById(userID)

    if (userExists) {
        const newPost = await Posts.create({
            userID: userExists._id,

            type: 'post',
            caption: caption,
            mediaURL: mediaURL,
            likesCount: 0,
            repliesCount: 0,
            repostsCount: 0,
        })

        const response = {
            _id: newPost._id,
            userID: newPost.userID,
            type: newPost.type,
            caption: newPost.caption,
            mediaURL: newPost.mediaURL,
            likesCount: newPost.likesCount,
            repliesCount: newPost.repliesCount,
            repostsCount: newPost.repostsCount,
            postAuthorFirstName: userExists.userFirstName,
            postAuthorMiddleName: userExists.userMiddleName,
            postAuthorLastName: userExists.userLastName,
            userName: userExists.userName,
            avatarURL: userExists.avatarURL,
            createdAt: newPost.createdAt
        }
        res.status(201).json(response);
    } else {
        res.status(404).json({ message: 'User not found.' });
    }

})

module.exports = {
    createNewPost
}