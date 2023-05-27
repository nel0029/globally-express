const { Posts, Replies, Reposts, Likes } = require('../../models/postsModel');
const { Users } = require('../../models/userModel');
const asyncHandler = require('express-async-handler');

const combinePublicData = asyncHandler(async (req, res) => {
    const userID = req.query.userID; // Assuming you have the current user ID stored in req.userId

    const postsQuery = await Posts.find().sort({ createdAt: -1 }).lean().exec();
    const repliesQuery = await Replies.find().sort({ createdAt: -1 }).lean().exec();
    const repostsQuery = await Reposts.find().sort({ createdAt: -1 }).lean().exec();
    const likesQuery = await Likes.find().sort({ createdAt: -1 }).lean().exec();

    const [posts, replies, reposts, likes] = await Promise.all([
        postsQuery,
        repliesQuery,
        repostsQuery,
        likesQuery
    ]);

    const combinedData = [...posts, ...replies, ...reposts];

    const userIds = combinedData.map((item) => item.userID); // Extract all unique user IDs from the combined data
    const parentUserIds = combinedData
        .filter((item) => item.parentPostID) // Filter only reposts
        .map((item) => item.parentUserID); // Extract all unique parent user IDs

    const users = await Users.find({ _id: { $in: userIds } }).lean().exec(); // Fetch users based on their IDs
    const parentUsers = await Users.find({ _id: { $in: parentUserIds } }).lean().exec(); // Fetch parent users based on their IDs

    const userMap = users.reduce((map, user) => {
        map[user._id] = {
            userID: user._id,
            userFirstName: user.userFirstName,
            userMiddleName: user.userMiddleName,
            userLastName: user.userLastName,
            userName: user.userName,
            avatarURL: user.avatarURL
        };
        return map;
    }, {});

    const parentUserMap = parentUsers.reduce((map, parentUser) => {
        map[parentUser._id] = {
            userName: parentUser.userName
        };
        return map;
    }, {});

    combinedData.forEach((item) => {
        item.liked = likes.some((like) => {
            return like.parentID === String(item._id) && like.userID === userID;
        });
        const userData = userMap[item.userID];
        item.postAuthorFirstName = userData.userFirstName;
        item.postAuthorMiddleName = userData.userMiddleName;
        item.postAuthorLastName = userData.userLastName;
        item.userName = userData.userName;
        item.avatarURL = userData.avatarURL;

        if (item.parentID) {
            const parentPost = combinedData.find((post) => post._id.toString() === item.parentID);
            if (parentPost) {
                const parentUserData = userMap[parentPost.userID];
                item.parentID = parentPost.parentID;
                item.parentCaption = parentPost.caption;
                item.parentMediaURL = parentPost.mediaURL;
                item.parentAuthorFirstName = parentUserData.userFirstName;
                item.parentAuthorMiddleName = parentUserData.userMiddleName;
                item.parentAuthorLastName = parentUserData.userLastName;
                item.parentUserID = parentUserData.userID;
                item.parentUserName = parentUserData.userName;
                item.parentAvatarURL = parentUserData.avatarURL;
            }
        }

        const like = likes.find((like) => {
            return like.parentID === String(item._id) && like.userID === userID;
        });
        if (like) {
            item.likeID = like._id;
        } else {
            item.likeID = null;
        }
    });

    combinedData.sort((b, a) => b.createdAt - a.createdAt);
    res.json(combinedData);
});


const ReadPostDataController = (req, res) => {
    combinePublicData(req, res);
    //console.log(req.params.userID)
};

module.exports = {
    ReadPostDataController
};
