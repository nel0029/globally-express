const { Posts, Replies, Reposts, Likes } = require('../../models/postsModel')
const { Users } = require('../../models/userModel')
const asyncHandler = require('express-async-handler')



const deleteLike = asyncHandler(async (req, res) => {
    const { authorID, likeID } = req.query

    const userExists = await Users.findById(authorID)


    if (userExists) {
        const likeExists = await Likes.findById(likeID);

        if (likeExists) {
            if (String(likeExists.authorID) === authorID && String(likeExists._id) === likeID) {
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
                    parentID: likeExists.parentPostID,
                    authorID: likeExists.authorID
                };
                res.status(202).json(unlikeID);
            } else {
                res.status(401).json({ message: 'Unauthorized request' });
            }
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } else {
        res.status(404).json({ message: "User not fount" })
    }

})

module.exports = deleteLike
