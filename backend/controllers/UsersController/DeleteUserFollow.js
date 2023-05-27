const asyncHandler = require('express-async-handler');
const { Users, Following } = require('../../models/userModel');

const DeleteUserFollow = asyncHandler(async (req, res) => {
    const { userID, userFollowingID } = req.body;

    const userExists = await Users.findById(userID);

    if (userExists) {
        const userFollowingExist = await Following.findOne({
            $and: [
                { followingID: userFollowingID },
                { followerID: userID }
            ]
        });

        if (userFollowingExist) {
            await userFollowingExist.deleteOne()
            const unfollowID = {
                followingID: userFollowingExist.followingID,
                followerID: userFollowingExist.followerID
            }

            res.status(202).json({ unfollowID })
        } else {

            res.status(204).json({ message: "You did not follow this user" })
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

module.exports = DeleteUserFollow;
