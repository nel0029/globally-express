const { Users } = require('../../models/userModel')
const { Posts, Replies, Reposts, Likes, Poll, PollOptions, PollRespondents } = require('../../models/postsModel')
const asyncHandler = require('express-async-handler')


const createNewPollResponse = asyncHandler(async (req, res) => {
    const { postID, optionID, respondentID } = req.body


    const respondentExists = await Users.findById(respondentID)


    if (respondentExists) {

        const pollResponseExists = await PollRespondents.findOne({ $and: [{ optionID: optionID }, { respondentID: respondentID }] })

        if (pollResponseExists) {

            res.status(400).json({ message: "You already choosed" })

        } else {

            const postExists = await Posts.findById(postID)

            if (postExists) {

                const optionExists = await PollOptions.findById(optionID)

                if (optionExists) {
                    const newPollResponse = new PollRespondents({
                        hasChoosed: true,
                        respondentID: respondentExists._id,
                        postID: postExists._id,
                        optionID: optionExists._id
                    })

                    await newPollResponse.save();

                    res.status(200).json(newPollResponse)

                } else {

                    res.status(404).json({ message: "Option does not exists" })

                }
            } else {

                res.status(404).json({ messge: "Poll did not exists" })

            }
        }

    } else {

        res.status(404).json({ message: "User not found" })

    }
})

module.exports = createNewPollResponse