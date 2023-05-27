const { Users, Following } = require('../../models/userModel')
const { Posts, Replies, Reposts, Likes } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')



const handlePostAction = async (res, userExists, postID, caption, mediaURL, parentType, Model, countField, type) => {
    if (userExists) {
        let parentExists;

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
            const newPost = await Model.create({
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
            const replyResponse = {
                _id: newPost._id,
                userID: newPost.userID,
                type: newPost.type,
                caption: newPost.caption,
                mediaURL: newPost.mediaURL,
                likesCount: newPost.likesCount,
                repliesCount: newPost.repliesCount,
                repostsCount: newPost.repostsCount,
                parentType: newPost.parentType,
                postAuthorFirstName: userExists.userFirstName,
                postAuthorMiddleName: userExists.userMiddleName,
                postAuthorLastName: userExists.userLastName,
                userName: userExists.userName,
                avatarURL: userExists.avatarURL,
                createdAt: newPost.createdAt,
                parentUserID: parentAuthor._id,
                parentUserName: parentAuthor.userName,
            }

            const repostResponse = {
                _id: newPost._id,
                userID: newPost.userID,
                type: newPost.type,
                caption: newPost.caption,
                mediaURL: newPost.mediaURL,
                likesCount: newPost.likesCount,
                repliesCount: newPost.repliesCount,
                repostsCount: newPost.repostsCount,
                parentType: newPost.parentType,
                postAuthorFirstName: userExists.userFirstName,
                postAuthorMiddleName: userExists.userMiddleName,
                postAuthorLastName: userExists.userLastName,
                userName: userExists.userName,
                avatarURL: userExists.avatarURL,
                createdAt: newPost.createdAt,
                parentUserID: parentAuthor._id,
                parentUserName: parentAuthor.userName,
                parentAuthorFirstName: parentAuthor.userFirstName,
                parentAuthorMiddleName: parentAuthor.userMiddleName,
                parentAuthorLastName: parentAuthor.userLastName,
                parentAvatarURL: parentAuthor.avatarURL,
                parentMediaURL: parentExists.mediaURL,
                parentCaption: parentExists.caption

            }
            if (type === "reply") {
                res.status(201).json(replyResponse);
            }

            if (type === "repost") {
                res.status(201).json(repostResponse);
            }
        } else {
            res.status(404).json({ message: 'Parent Not Found' });
        }
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
};


const likeAction = async (res, userExists, postID, parentType, countField) => {
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
        res.status(404).json({ message: "User not found" })
    }
}

const CreatePostDataController = asyncHandler(async (req, res) => {
    const { userID, email, userName, actionType, postID, caption, mediaURL, parentType, followingID } = req.body

    const userExists = await Users.findOne({
        $or: [{ _id: userID }, { userName: userName }, { email: email }],
    });

    if (userExists) {
        switch (actionType) {
            case 'create-post':

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
                break

            case 'create-reply':
                handlePostAction(res, userExists, postID, caption, mediaURL, parentType, Replies, 'repliesCount', 'reply');
                break
            case 'create-repost':
                handlePostAction(res, userExists, postID, caption, mediaURL, parentType, Reposts, 'repostsCount', 'repost');
                break

            case 'like':
                likeAction(res, userExists, postID, parentType, 'likesCount')
                break
            case 'follow':
                const followingExists = await Following.findOne({
                    followingID: followingID,
                    followerID: userExists._id
                })

                if (followingExists) {
                    res.status(400).json({ message: "You already followed this user" })
                } else {
                    const newFollow = await Following.create({
                        followingID: followingID,
                        followerID: userExists._id
                    })

                    res.status(201).json(newFollow)
                }

                break
            default:
                res.status(400).json({ message: 'Invalid action type.' });
                break;
        }
    } else {
        res.status(404).json({ message: 'User not found.' });
    }

})

module.exports = {
    CreatePostDataController
}