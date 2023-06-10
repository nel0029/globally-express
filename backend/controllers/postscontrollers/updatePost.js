const { Users } = require('../../models/userModel')
const { Posts } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')


const updatePost = asyncHandler(async (req, res) => {

    const { authorID, _id, caption } = req.body
    const userExists = await Users.findById(authorID)

    if (userExists) {

        const postExists = await Posts.findById(_id)
        if (postExists) {
            if (postExists.authorID.toString() === userExists._id.toString()) {
                postExists.caption = caption;
                await postExists.save();

                res.status(202).json(postExists);

            } else {

                res.status(401).json({ message: "Unauthorized request" })
            }

        } else {
            console.log("post not found")
            res.status(404).json({ message: "Post not found" })
        }

    } else {
        res.status(404).json({ message: "User not found" })
    }
})

module.exports = updatePost