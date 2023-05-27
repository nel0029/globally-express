const { Users } = require('../../models/userModel')
const { Posts, Replies, Reposts } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')

const createNewRepost = asyncHandler(async (req, res) => {

    const { userID, postID, parentType, caption, mediaURL } = req.body

    const userExists = await Users.findById(userID)

    if (userExists) {

        let parentExists

        switch (parentType) {
            case 'post':
                parentExists = await Posts.findOne({ _id: postID });
                break;
            case 'reply':
                parentExists = await Replies.findOne({ _id: postID });
                break;
            case 'repost':
                parentExists = await Reposts.findOne({ _id: postID });
                break;
            default:
                res.status(400).json({ message: 'Invalid Parent Type' });
                return;
        }

        if (parentExists) {
            const newRepost = await Reposts.create({
                userID: userExists._id,
                parentID: parentExists._id,
                parentType: parentExists.type,
                parentUserID: parentExists.userID,
                type: type,
                caption: caption,
                mediaURL: mediaURL,
                likesCount: 0,
                repliesCount: 0,
                repostsCount: 0,
            });

            await parentExists.updateOne({ $inc: { [countField]: 1 } });
            const parentAuthor = await Users.findById(parentExists.userID)

            const repostResponse = {
                _id: newRepost._id,
                userID: newRepost.userID,
                type: newRepost.type,
                caption: newRepost.caption,
                mediaURL: newRepost.mediaURL,
                likesCount: newRepost.likesCount,
                repliesCount: newRepost.repliesCount,
                repostsCount: newRepost.repostsCount,
                parentType: newRepost.parentType,
                postAuthorFirstName: userExists.userFirstName,
                postAuthorMiddleName: userExists.userMiddleName,
                postAuthorLastName: userExists.userLastName,
                userName: userExists.userName,
                avatarURL: userExists.avatarURL,
                createdAt: newRepost.createdAt,
                parentUserID: parentAuthor._id,
                parentUserName: parentAuthor.userName,
                parentAuthorFirstName: parentAuthor.userFirstName,
                parentAuthorMiddleName: parentAuthor.userMiddleName,
                parentAuthorLastName: parentAuthor.userLastName,
                parentAvatarURL: parentAuthor.avatarURL,
                parentMediaURL: parentExists.mediaURL,
                parentCaption: parentExists.caption

            }

            res.status(201).json(repostResponse);

        } else {
            res.status(404).json({ message: 'Parent Not Found' });
        }

    } else {
        res.status(404).json({ message: 'User not found.' });
    }

})

module.exports = {
    createNewRepost
}