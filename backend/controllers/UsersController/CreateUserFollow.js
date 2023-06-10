const asyncHandler = require('express-async-handler');
const { Users, Following } = require('../../models/userModel');
const { ObjectId } = require('mongodb');

const CreateUserFollow = asyncHandler(async (req, res) => {
    const { userID, userFollowingID } = req.body;


    const userExists = await Users.findById(userID);
    const userFollowingExists = await Users.findById(userFollowingID)

    if (userExists && userFollowingExists) {
        const userFollowExist = await Following.findOne({
            $and: [
                { followingID: userFollowingID },
                { followerID: userID }
            ]
        });


        if (userFollowExist) {
            res.status(409).json({ message: "You already followed this account" })
            console.log("Failed")
        } else {
            const newFollow = await Following.create({
                followingID: new ObjectId(userFollowingID),
                followerID: new ObjectId(userID)
            })

            const followResponse = {
                followID: newFollow._id,
                followingID: newFollow.followingID,
                followerID: newFollow.followerID,
            }

            res.status(201).json(followResponse)
        }
    } else {
        res.status(404).json({ message: "Users not found" });
    }
});

module.exports = { CreateUserFollow };
