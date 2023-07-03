const asyncHandler = require('express-async-handler');
const { Users, Following } = require('../../models/userModel');
const { ContactLists } = require('../../models/messageModel');
const { ObjectId } = require('mongodb');

const DeleteUserFollow = asyncHandler(async (req, res) => {
    const { followID, userID } = req.query;


    const userExists = await Users.findById(userID);

    if (userExists) {
        const userFollowingExist = await Following.findById(followID);

        if (userFollowingExist) {

            if (userFollowingExist.followerID.toString() === userID) {
                await userFollowingExist.deleteOne()
                const unfollowData = {
                    followID: userFollowingExist._id,
                    followingID: userFollowingExist.followingID
                }

                await ContactLists.findOneAndDelete({
                    ownerID: userID,
                    contactID: userFollowingExist.followingID
                }).exec()

                res.status(202).json(unfollowData)
            } else {

                res.status(401).json({ message: "Unauthorized" })
            }

        } else {

            res.status(204).json({ message: "You did not follow this user" })
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

module.exports = DeleteUserFollow;
