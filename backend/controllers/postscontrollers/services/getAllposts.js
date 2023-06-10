const { Posts, Replies, Reposts, Likes } = require('../../models/postsModel');
const { Users, Following } = require('../../models/userModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getAllPosts = async (authorID) => {
    const posts = await Posts.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'authorID',
                foreignField: '_id',
                as: 'author',
            },
        },
        {
            $lookup: {
                from: 'replies',
                let: { parentPostID: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [{ $toObjectId: '$parentPostID' }, '$$parentPostID'],
                            },
                        },
                    },
                ],
                as: 'replies',
            },
        },
        {
            $lookup: {
                from: 'reposts',
                let: { parentPostID: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [{ $toObjectId: '$parentPostID' }, '$$parentPostID'],
                            },
                        },
                    },
                ],
                as: 'reposts',
            },
        },
        {
            $lookup: {
                from: 'likes',
                let: { parentPostID: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [{ $toObjectId: '$parentPostID' }, '$$parentPostID'],
                            },
                        },
                    },
                    {
                        $project: {
                            authorID: 1,
                            _id: 1,
                        },
                    },
                ],
                as: 'likes',
            },
        },
        {
            $lookup: {
                from: 'followings',
                let: { authorID: '$authorID' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$followingID', '$$authorID'] },
                        },
                    },
                ],
                as: 'followers',
            },
        },
        {
            $addFields: {
                postAuthorFirstName: { $arrayElemAt: ['$author.userFirstName', 0] },
                postAuthorMiddleName: { $arrayElemAt: ['$author.userMiddleName', 0] },
                postAuthorLastName: { $arrayElemAt: ['$author.userLastName', 0] },
                postAuthorUserName: { $arrayElemAt: ['$author.userName', 0] },
                postAuthorAvatarURL: { $arrayElemAt: ['$author.avatarURL', 0] },
                likesCount: { $size: '$likes' },
                repliesCount: { $size: '$replies' },
                repostCount: { $size: '$reposts' },
                isLiked: {
                    $cond: [
                        { $in: [ObjectId(authorID), '$likes.authorID'] },
                        true,
                        false
                    ]
                },
                likeID: {
                    $ifNull: [
                        {
                            $let: {
                                vars: {
                                    filteredLikes: {
                                        $filter: {
                                            input: '$likes',
                                            cond: { $eq: ['$$this.authorID', new ObjectId(authorID)] },
                                        },
                                    },
                                },
                                in: { $arrayElemAt: ['$$filteredLikes._id', 0] },
                            },
                        },
                        null,
                    ],
                },
                isFollowedAuthor: {
                    $in: [new ObjectId(authorID), '$followers.followerID'],
                },
                followedID: {
                    $ifNull: [
                        {
                            $let: {
                                vars: {
                                    filteredFollowers: {
                                        $filter: {
                                            input: '$followers',
                                            cond: { $eq: ['$$this.authorID', new ObjectId(authorID)] },
                                        },
                                    },
                                },
                                in: { $arrayElemAt: ['$$filteredFollowers._id', 0] },
                            },
                        },
                        null,
                    ],
                },
            },
        },
        {
            $project: {
                _id: 1,
                caption: 1,
                mediaURL: 1,
                type: 1,
                createdAt: 1,
                // Include other necessary fields from the posts collection
                postAuthorFirstName: 1,
                postAuthorMiddleName: 1,
                postAuthorLastName: 1,
                postAuthorUserName: 1,
                postAuthorAvatarURL: 1,
                likesCount: 1,
                repliesCount: 1,
                repostCount: 1,
                isLiked: 1,
                likeID: 1,
                isFollowedAuthor: 1,
                followedID: 1,
                // Include other necessary fields extracted from other collections
            },
        },
    ]);



    return posts
}


module.exports = getAllPosts
