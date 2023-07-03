const asyncHandler = require('express-async-handler');
const { Users, Following } = require('../../models/userModel');
const { ObjectId } = require('mongodb');

const ReadUsersToFollow = asyncHandler(async (req, res) => {
    const { userID } = req.query

    const users = await Users.aggregate([
        {
            $lookup: {
                from: "followings",
                localField: "_id",
                foreignField: "follower._id",
                as: "followedUsers"
            }
        },
        {
            $match: {
                followedUsers: {
                    $not: {
                        $elemMatch: {
                            followerID: ObjectId(userID)
                        }
                    }
                }
            }
        }
    ]);

    res.status(200).json(users);
})

module.exports = ReadUsersToFollow