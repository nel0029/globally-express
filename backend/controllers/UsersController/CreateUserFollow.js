const asyncHandler = require('express-async-handler');
const { Users, Following } = require('../../models/userModel');

const CreateUserFollow = asyncHandler(async (req, res) => {
    const { userID, userFollowingID } = req.body;

    const userExists = await Users.findById(userID);

    if (userExists) {
        const userFollowExist = await Following.findOne({
            $and: [
                { followingID: userFollowingID },
                { followerID: userID }
            ]
        });

        const userFollowingExist = await Users.findById(userFollowingID)

        if (userFollowExist) {
            res.status(409).json({ message: "You already followed this account" })
        } else {
            const newFollow = await Following.create({
                followingID: userFollowingID,
                followerID: userID
            })

            await userExists.updateOne({ $inc: { followingCounts: 1 } })
            await userFollowingExist.updateOne({ $inc: { followersCounts: 1 } })

            const followResponse = {
                _id: newFollow._id,
                followingID: newFollow.followingID,
                followerID: newFollow.followerID,
                userFollowingCount: userExists.followingCounts,
                userFollowingFollowersCount: userFollowingExist.followersCounts
            }
            res.status(201).json(followResponse)
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

module.exports = { CreateUserFollow };
