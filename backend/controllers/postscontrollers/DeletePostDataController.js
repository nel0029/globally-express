const { Posts, Replies, Reposts, Likes } = require('../../models/postsModel')
const { Users } = require('../../models/userModel')
const asyncHandler = require('express-async-handler')

const DeletePostDataController = asyncHandler(async (req, res) => {
    try {
        const { actionType } = req.body
        const { userID, postID, likeID } = req.query

        const userExists = await Users.findById(userID)

        if (userExists) {
            switch (actionType) {
                case 'delete-post':
                    const postExists = await Posts.findOne({ _id: postID })

                    if (postExists) {
                        if (postExists.userID === userID) {

                            await Promise.all([
                                Posts.findByIdAndDelete(postExists._id),
                                Replies.deleteMany({ parentID: postExists._id }),
                                Reposts.deleteMany({ parentID: postExists._id }),
                                Likes.deleteMany({ parentID: postExists._id }),
                            ]);

                            res.json({ postID: postExists._id });
                        } else {
                            res.status(401).json({ message: "Unauthorized request" })
                        }
                    } else {
                        res.status(404).json({ message: "Post not found" })
                    }
                    break

                case 'delete-reply':
                    const replyExists = await Replies.findOne({ _id: postID })
                    console.log(replyExists)
                    if (replyExists) {
                        if (replyExists.userID === userID) {
                            await Replies.findByIdAndDelete(replyExists._id);
                            await Promise.all([
                                Replies.deleteMany({ parentID: replyExists._id }),
                                Reposts.deleteMany({ parentID: replyExists._id }),
                                Likes.deleteMany({ parentID: replyExists._id }),
                            ]);

                            switch (replyExists.parentType) {
                                case 'post':
                                    await Posts.findByIdAndUpdate(replyExists.parentID, {
                                        $inc: { repliesCount: -1 }
                                    })
                                    res.status(202).json({ message: "Post Replies Count updated" })
                                    break

                                case 'reply':
                                    await Replies.findByIdAndUpdate(replyExists.parentID, {
                                        $inc: { repliesCount: -1 }
                                    })
                                    res.status(202).json({ message: "Reply Replies Count updated" })
                                    break
                                case 'repost':
                                    await Reposts.findByIdAndUpdate(replyExists.parentID, {
                                        $inc: { repliesCount: -1 }
                                    })
                                    res.status(202).json({ message: "Repost Replies Count updated" })
                                    break
                                default:
                                    res.status(400).json({ message: "Invalid Parent Type" })
                            }

                            res.json({ message: 'Data deleted successfully' });
                        } else {
                            res.status(401).json({ message: "Unauthorized request" })
                        }
                    } else {
                        res.status(404).json({ message: "Post not found" })
                    }
                    break
                case 'delete-repost':
                    const repostExists = await Reposts.findOne({ _id: postID })

                    if (repostExists) {
                        if (repostExists.userID === userID) {

                            await Promise.all([
                                Replies.deleteMany({ parentID: repostExists._id }),
                                Reposts.deleteMany({ parentID: repostExists._id }),
                                Likes.deleteMany({ parentID: repostExists._id }),
                            ]);
                            await Posts.findByIdAndUpdate(repostExists.parentID, {
                                $inc: { repostsCount: -1 }
                            })
                            res.json({ message: 'Data deleted successfully' });
                        } else {
                            res.status(401).json({ message: "Unauthorized request" })
                        }
                    } else {
                        res.status(404).json({ message: "Post not found" })
                    }
                    break

                case 'unlike':
                    const likeExists = await Likes.findById(likeID);
                    if (likeExists) {
                        if (likeExists.userID === userID) {

                            switch (likeExists.parentType) {
                                case 'post':
                                    await Posts.findByIdAndUpdate(likeExists.parentID, {
                                        $inc: { likesCount: -1 },
                                    });
                                    break;
                                case 'reply':
                                    await Replies.findByIdAndUpdate(likeExists.parentID, {
                                        $inc: { likesCount: -1 },
                                    });
                                    break;
                                case 'repost':
                                    await Reposts.findByIdAndUpdate(likeExists.parentID, {
                                        $inc: { likesCount: -1 },
                                    });
                                    break;
                                default:
                                    res.status(400).json({ message: 'Invalid Parent Type' });
                                    return;
                            }
                            await likeExists.deleteOne();
                            const unlikeID = {
                                parentID: likeExists.parentID,
                                userID: likeExists.userID
                            };
                            res.json(unlikeID);
                        } else {
                            res.status(401).json({ message: 'Unauthorized request' });
                        }
                    } else {
                        res.status(404).json({ message: 'Data not found' });
                    }
                    break;


                default:
                    res.status(400).json({ message: "Invalid Action Type" })
            }
        } else {
            res.status(404).json({ message: "User not found" })
        }

    } catch (error) {
        console.log(error)
    }
})

module.exports = {
    DeletePostDataController
}