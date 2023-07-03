const { Users } = require('../../models/userModel')
const { Posts, Replies, Reposts } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')



const createNewReply = asyncHandler(async (req, res) => {

    const { authorID, postID, parentType, caption, mediaURLs } = req.body


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
            const newReply = await Replies.create({
                authorID: userExists._id,
                parentPostID: parentExists._id,
                parentType: parentExists.type,
                parentAuthorID: parentExists.authorID,
                postAuthorUserName: userExists.userName,
                parentUserName: parentUserName.userName,
                type: "reply",
                caption: caption,
                mediaURL: mediaURLs,
                likesCount: 0,
                repliesCount: 0,
                repostsCount: 0,
            });



            await parentExists.updateOne({ $inc: { repliesCount: 1 } });
            const parentAuthor = await Users.findById(parentExists.authorID)

            const replyResponse = {
                _id: newReply._id,
                authorID: newReply.authorID,
                type: newReply.type,
                caption: newReply.caption,
                mediaURL: mediaURLs,
                likesCount: 0,
                repliesCount: 0,
                repostsCount: 0,
                parentType: newReply.parentType,
                parentPostID: newReply.parentPostID,
                postAuthorFirstName: userExists.userFirstName,
                postAuthorMiddleName: userExists.userMiddleName,
                postAuthorLastName: userExists.userLastName,
                postAuthorUserName: userExists.userName,
                postAuthorAvatarURL: userExists.avatarURL,
                createdAt: newReply.createdAt,
                parentAuthorID: parentAuthor._id,
                parentUserName: parentAuthor.userName,
            }

            res.status(201).json(replyResponse);

        } else {
            res.status(404).json({ message: 'Parent Not Found' });
        }

    } else {
        res.status(404).json({ message: 'User not found.' });
    }

})

module.exports = createNewReply
