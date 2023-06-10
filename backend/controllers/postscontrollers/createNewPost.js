const { Users } = require('../../models/userModel')
const { Posts } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')


const createNewPost = asyncHandler(async (req, res) => {

    const { authorID, caption, mediaURL } = req.body

    const userExists = await Users.findById(authorID)

    if (userExists) {
        const newPost = await Posts.create({
            authorID: userExists._id,
            type: 'post',
            caption: caption,
            mediaURL: mediaURL,
        })

        const response = {
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
            createdAt: newPost.createdAt
        }
        res.status(201).json(response);
    } else {
        res.status(404).json({ message: 'User not found.' });
    }

})

module.exports = createNewPost
