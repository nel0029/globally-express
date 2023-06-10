const { Users } = require('../../models/userModel')
const { Posts, Replies, Reposts } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')

const createNewRepost = asyncHandler(async (req, res) => {

    const { authorID, parentAuthorID, postID, parentType, caption, mediaURL } = req.body

    const userExists = await Users.findById(authorID)


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
            const parentUserName = await Users.findById(parentExists.authorID)
            const newRepost = await Reposts.create({
                authorID: userExists._id,
                parentPostID: parentExists._id,
                parentType: parentExists.type,
                parentAuthorID: parentExists.authorID,
                postAuthorUserName: userExists.userName,
                parentUserName: parentUserName.userName,
                parentPostID: parentExists._id,
                type: "repost",
                caption: caption,
                mediaURL: mediaURL,
                likesCount: 0,
                repliesCount: 0,
                repostsCount: 0,
            });

            await parentExists.updateOne({ $inc: { repostsCount: 1 } });
            const parentAuthor = await Users.findById(parentExists.authorID)

            const repostResponse = {
                _id: newRepost._id,
                authorID: newRepost.authorID,
                parentPostID: newRepost.parentPostID,
                type: newRepost.type,
                caption: newRepost.caption,
                mediaURL: newRepost.mediaURL,
                likesCount: 0,
                repliesCount: 0,
                repostsCount: 0,
                parentType: newRepost.parentType,
                parentID: newRepost.parentID,
                postAuthorFirstName: userExists.userFirstName,
                postAuthorMiddleName: userExists.userMiddleName,
                postAuthorLastName: userExists.userLastName,
                postAuthorUserName: userExists.userName,
                postAuthorAvatarURL: userExists.avatarURL,
                createdAt: newRepost.createdAt,
                parentAuthorID: parentAuthor._id,
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

module.exports = createNewRepost
