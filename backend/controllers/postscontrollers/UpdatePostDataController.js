const { Users } = require('../../models/userModel')
const { Posts, Replies, Reposts } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')

const UpdatePostDataController = asyncHandler(async (req, res) => {

    const { actionType, postID, userID, caption, mediaURL, likeID } = req.body;
    const userExists = await Users.findOne({ _id: userID });

    if (userExists) {
        const postExists = await Posts.findOne({ _id: postID });
        const repliesExists = await Replies.findOne({ _id: postID });
        const repostsExists = await Reposts.findOne({ _id: postID });

        switch (actionType) {
            case 'update-post':
                if (postExists) {
                    if (userID === postExists.userID) {
                        postExists.caption = caption;
                        await postExists.save();

                        res.status(202).json(postExists);
                    } else {
                        res.status(401).json({ message: 'Not authorized' });
                    }
                } else {
                    res.status(404).json({ message: 'Post not found' });
                }
                break;
            case 'update-reply':
                if (repliesExists) {
                    if (userID === repliesExists.userID) {
                        repliesExists.caption = caption;
                        await repliesExists.save();
                        res.status(202).json(repliesExists);
                    } else {
                        res.status(401).json({ message: 'Not authorized' });
                    }
                } else {
                    res.status(404).json({ message: 'Reply not found' });
                }
                break;
            case 'update-repost':
                if (repostsExists) {
                    if (userID === repostsExists.userID) {
                        repostsExists.caption = caption;
                        await repostsExists.save();
                        res.status(202).json(repostsExists)
                    } else {
                        res.status(401).json({ message: 'Not authorized' });
                    }
                } else {
                    res.status(404).json({ message: 'Repost not found' });
                }
                break;
            default:
                res.status(400).json({ message: 'Invalid action type' });
                break;
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }

})

module.exports = {
    UpdatePostDataController,
};
