const { Posts, Replies, Reposts, Likes } = require('../../models/postsModel');
const { Users, Following } = require('../../models/userModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const readAllLikesByUser = asyncHandler(async (req, res) => {
    const { userName } = req.params
    const { userID } = req.query

    const author = await Users.findOne({ userName: userName })

    const likedPost = await Likes.aggregate([
        {
            $match: {
                authorID: author._id
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "parentPostID",
                foreignField: "_id",
                as: "posts"
            }
        },
        {
            $unwind: "$posts"
        },

        {
            $lookup: {
                from: "users",
                localField: "posts.authorID",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            $unwind: "$author"
        },
        {
            $lookup: {
                from: "replies",
                localField: "posts._id",
                foreignField: "parentPostID",
                as: "replies"
            }
        },

        {
            $lookup: {
                from: "reposts",
                localField: "posts._id",
                foreignField: "parentPostID",
                as: "reposts"
            }
        },

        {
            $lookup: {
                from: "likes",
                localField: "posts._id",
                foreignField: "parentPostID",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "followings",
                localField: "posts.authorID",
                foreignField: "followingID",
                as: "followers"
            }
        },
        {
            $project: {
                _id: "$posts._id",
                caption: "$posts.caption",
                mediaURL: "$posts.mediaURL",
                type: "$posts.type",
                authorID: "$posts.authorID",
                postAuthorFirstName: "$author.userFirstName",
                postAuthorMiddleName: "$author.userMiddleName",
                postAuthorLastName: "$author.userLastName",
                postAuthorUserName: "$author.userName",
                postAuthorAvatarURL: "$author.avatarURL",
                likesCount: { $size: '$likes' },
                repliesCount: { $size: '$replies' },
                repostsCount: { $size: '$reposts' },
                isLiked: {
                    $cond: [
                        { $in: [new ObjectId(userID), '$likes.authorID'] },
                        true,
                        false
                    ]
                },

                likeID: {
                    $ifNull: [
                        {
                            $let:
                            {
                                vars: {
                                    filteredLikes: {
                                        $filter: {
                                            input: '$likes',
                                            cond: { $eq: ['$$this.authorID', new ObjectId(userID)] },
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
                    $in: [new ObjectId(userID), '$followers.followerID'],
                },
                followedID: {
                    $ifNull: [
                        {
                            $let: {
                                vars: {
                                    filteredFollowers: {
                                        $filter: {
                                            input: '$followers',
                                            cond: { $eq: ['$$this.authorID', new ObjectId(userID)] },
                                        },
                                    },
                                },
                                in: { $arrayElemAt: ['$$filteredFollowers._id', 0] },
                            },
                        },
                        null,
                    ],
                },
                createdAt: "$posts.createdAt",
                updatedAt: "$posts.updatedAt",
            }
        }
    ]);


    const likedReplies = await Likes.aggregate([
        {
            $match: {
                authorID: author._id
            }
        },
        {
            $lookup: {
                from: "replies",
                localField: "parentPostID",
                foreignField: "_id",
                as: "likedReplies"
            }
        },
        {
            $unwind: "$likedReplies"
        },

        {
            $lookup: {
                from: "users",
                localField: "likedReplies.authorID",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            $unwind: "$author"
        },
        {
            $lookup: {
                from: "replies",
                localField: "likedReplies._id",
                foreignField: "parentPostID",
                as: "replies"
            }
        },

        {
            $lookup: {
                from: "reposts",
                localField: "likedReplies._id",
                foreignField: "parentPostID",
                as: "reposts"
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "likedReplies.parentAuthorID",
                foreignField: "_id",
                as: "parentAuthor"
            }
        },

        {
            $lookup: {
                from: "likes",
                localField: "likedReplies._id",
                foreignField: "parentPostID",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "followings",
                localField: "likedReplies.authorID",
                foreignField: "followingID",
                as: "followers"
            }
        },
        {
            $project: {
                _id: "$likedReplies._id",
                caption: "$likedReplies.caption",
                mediaURL: "$likedReplies.mediaURL",
                type: "$likedReplies.type",
                authorID: "$likedReplies.authorID",
                postAuthorFirstName: "$author.userFirstName",
                postAuthorMiddleName: "$author.userMiddleName",
                postAuthorLastName: "$author.userLastName",
                postAuthorUserName: "$author.userName",
                postAuthorAvatarURL: "$author.avatarURL",
                parentPostID: "$likedReplies.parentPostID",
                parentType: "$likedReplies.parentType",
                parentAuthorID: "$likedReplies.parentAuthorID",
                parentUserName: "$parentAuthor.userName",
                likesCount: { $size: '$likes' },
                repliesCount: { $size: '$replies' },
                repostsCount: { $size: '$reposts' },
                isLiked: {
                    $cond: [
                        { $in: [new ObjectId(userID), '$likes.authorID'] },
                        true,
                        false
                    ]
                },

                likeID: {
                    $ifNull: [
                        {
                            $let:
                            {
                                vars: {
                                    filteredLikes: {
                                        $filter: {
                                            input: '$likes',
                                            cond: { $eq: ['$$this.authorID', new ObjectId(userID)] },
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
                    $in: [new ObjectId(userID), '$followers.followerID'],
                },
                followedID: {
                    $ifNull: [
                        {
                            $let: {
                                vars: {
                                    filteredFollowers: {
                                        $filter: {
                                            input: '$followers',
                                            cond: { $eq: ['$$this.authorID', new ObjectId(userID)] },
                                        },
                                    },
                                },
                                in: { $arrayElemAt: ['$$filteredFollowers._id', 0] },
                            },
                        },
                        null,
                    ],
                },
                createdAt: "$likedReplies.createdAt",
                updatedAt: "$likedReplies.updatedAt",
            }
        }
    ]);


    const likedReposts = await Likes.aggregate([
        {
            $match: {
                authorID: author._id
            }
        },
        {
            $lookup: {
                from: "reposts",
                localField: "parentPostID",
                foreignField: "_id",
                as: "likedReposts"
            }
        },
        {
            $unwind: "$likedReposts"
        },

        {
            $lookup: {
                from: "users",
                localField: "likedReposts.authorID",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            $unwind: "$author"
        },
        {
            $lookup: {
                from: "replies",
                localField: "likedReposts._id",
                foreignField: "parentPostID",
                as: "replies"
            }
        },

        {
            $lookup: {
                from: "reposts",
                localField: "likedReposts._id",
                foreignField: "parentPostID",
                as: "reposts"
            }
        },

        {
            $lookup: {
                from: "posts",
                localField: "likedReposts.parentPostID",
                foreignField: "_id",
                as: "parentPost"
            }
        },

        {
            $lookup: {
                from: "replies",
                localField: "likedReposts.parentPostID",
                foreignField: "_id",
                as: "parentReply"
            }
        },

        {
            $lookup: {
                from: "reposts",
                localField: "likedReposts.parentPostID",
                foreignField: "_id",
                as: "parentRepost"
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "likedReposts.parentAuthorID",
                foreignField: "_id",
                as: "parentAuthor"
            }
        },

        {
            $lookup: {
                from: "likes",
                localField: "likedReposts._id",
                foreignField: "parentPostID",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "followings",
                localField: "likedReposts.authorID",
                foreignField: "followingID",
                as: "followers"
            }
        },
        {
            $project: {
                _id: "$likedReposts._id",
                caption: "$likedReposts.caption",
                mediaURL: "$likedReposts.mediaURL",
                type: "$likedReposts.type",
                authorID: "$likedReposts.authorID",
                postAuthorFirstName: "$author.userFirstName",
                postAuthorMiddleName: "$author.userMiddleName",
                postAuthorLastName: "$author.userLastName",
                postAuthorUserName: "$author.userName",
                postAuthorAvatarURL: "$author.avatarURL",
                parentPostID: "$likedReposts.parentPostID",
                parentType: "$likedReposts.parentType",
                parentCaption: {
                    $cond: [
                        { $eq: ['$parentType', 'post'] },
                        { $arrayElemAt: ['$parentPost.caption', 0] },
                        {
                            $cond: [
                                { $eq: ['$parentType', 'reply'] },
                                { $arrayElemAt: ['$parentReply.caption', 0] },
                                { $arrayElemAt: ['$parentRepost.caption', 0] }, // Typo corrected from 'parentRepost' to 'paentRepost'
                            ]
                        }
                    ]
                },
                parentMediaURL: {
                    $cond: [
                        { $eq: ['$parentType', 'post'] },
                        { $arrayElemAt: ['$parentPost.mediaURL', 0] },
                        {
                            $cond: [
                                { $eq: ['$parentType', 'reply'] },
                                { $arrayElemAt: ['$parentReply.mediaURL', 0] },
                                { $arrayElemAt: ['$parentRepost.mediaURL', 0] }, // Typo corrected from 'parentRepost' to 'paentRepost'
                            ]
                        }
                    ]
                },
                parentAuthorID: "$likedReposts.parentAuthorID",
                parentUserName: "$parentAuthor.userName",
                parentAuthorFirstName: "$parentAuthor.userFirstName",
                parentAuthorMiddleName: "$parentAuthor.userMiddleName",
                parentAuthorLastName: "$parentAuthor.userLastName",
                parentAvatarURL: "$parentAuthor.avatarURL",
                likesCount: { $size: '$likes' },
                repliesCount: { $size: '$replies' },
                repostsCount: { $size: '$reposts' },
                isLiked: {
                    $cond: [
                        { $in: [new ObjectId(userID), '$likes.authorID'] },
                        true,
                        false
                    ]
                },

                likeID: {
                    $ifNull: [
                        {
                            $let:
                            {
                                vars: {
                                    filteredLikes: {
                                        $filter: {
                                            input: '$likes',
                                            cond: { $eq: ['$$this.authorID', new ObjectId(userID)] },
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
                    $in: [new ObjectId(userID), '$followers.followerID'],
                },
                followedID: {
                    $ifNull: [
                        {
                            $let: {
                                vars: {
                                    filteredFollowers: {
                                        $filter: {
                                            input: '$followers',
                                            cond: { $eq: ['$$this.authorID', new ObjectId(userID)] },
                                        },
                                    },
                                },
                                in: { $arrayElemAt: ['$$filteredFollowers._id', 0] },
                            },
                        },
                        null,
                    ],
                },
                createdAt: "$likedReposts.createdAt",
                updatedAt: "$likedReposts.updatedAt",
            }
        }
    ]);

    const combinedData = [...likedPost, ...likedReplies, ...likedReposts]
    combinedData.sort((a, b) => a.createdAt - b.createdAt)


    res.status(200).json(combinedData)

});



module.exports = readAllLikesByUser;
