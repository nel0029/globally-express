const { Users } = require('../../models/userModel')
const { Reposts } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')


const updateRepost = asyncHandler(async (req, res) => {

    const { authorID, postID, caption } = req.body
    const userExists = await Users.findById(authorID)

    if (userExists) {

        const repostExists = await Reposts.findById(postID)
        if (repostExists) {
            if (repostExists.authorID.toString() === String(userExists._id)) {
                repostExists.caption = caption;
                await repostExists.save();

                res.status(202).json(repostExists);

            } else {
                res.status(401).json({ message: "Unauthorized request" })
            }

        } else {
            res.status(404).json({ message: "Repost not found" })
        }

    } else {
        res.status(404).json({ message: "User not found" })
    }
})

module.exports = updateRepost