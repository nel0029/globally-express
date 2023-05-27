const asyncHandler = require('express-async-handler');
const { Users, Following } = require('../../models/userModel');

const ReadUserFollow = asyncHandler(async (req, res) => {
    const { userID, actionType } = req.query

    const userExists = await Users.findById(userID)
    if (userExists) {
        switch (actionType) {
            case 'get-user-following':
                if (userExists.private === false) {
                    const userFollowing = await Following.find({ followerID: userID }).sort({ createdAt: -1 }).lean().exec();
                    res.status(200).json(userFollowing)
                } else {
                    res.status(403).json({ message: "User hides their following" })
                }
                break
            case 'get-user-followers':
                if (userExists.private === false) {
                    const userFollowers = await Following.find({ followingID: userID }).sort({ createdAt: -1 }).lean().exec();
                    res.status(200).json(userFollowers)
                } else {
                    res.status(403).json({ message: "User hides their follower list" })
                }
                break
            default:
                res.status(400).json({ message: "Invalid Action Type" })
        }
    } else {
        res.status(404).json({ message: "User not found" })
    }


})

module.exports = ReadUserFollow