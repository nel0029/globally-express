const mongoose = require('mongoose')
const User = require('./userModel')
const moment = require('moment-timezone');



const postsSchema = mongoose.Schema({

    userID: String,
    type: String,
    postAuthorFirstName: String,
    privacy: String,
    postAuthorMiddleName: String,
    postAuthorLastName: String,
    postAuthorUserName: String,
    caption: String,
    mediaURL: [String],
    repliesCount: Number,
    likesCount: Number,
    repostsCount: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }

},
    {
        timestamps: true
    })


postsSchema.pre('save', function (next) {
    // Convert createdAt to "Asia/Manila" timezone
    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});

const repliesSchema = mongoose.Schema({

    userID: String,
    userName: String,
    type: String,
    parentID: String,
    parentType: String,
    parentUserID: String,
    privacy: String,
    caption: String,
    mediaURL: [String],
    repliesCount: Number,
    likesCount: Number,
    repostsCount: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }

},
    {
        timestamps: true
    })

repliesSchema.pre('save', function (next) {
    // Convert createdAt to "Asia/Manila" timezone
    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});

const repostsSchema = mongoose.Schema({

    userID: String,
    type: String,
    parentID: String,
    parentUserID: String,
    parentType: String,
    postAuthorFirstName: String,
    postAuthorMiddleName: String,
    postAuthorLastName: String,
    postAuthorUserName: String,
    privacy: String,
    caption: String,
    mediaURL: [String],
    repliesCount: Number,
    likesCount: Number,
    repostsCount: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }

},
    {
        timestamps: true
    })

repostsSchema.pre('save', function (next) {
    // Convert createdAt to "Asia/Manila" timezone
    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});

const likesSchema = mongoose.Schema({
    userID: String,
    type: String,
    parentID: String,
    parentType: String,
    privacy: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    }
)

likesSchema.pre('save', function (next) {
    // Convert createdAt to "Asia/Manila" timezone
    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});

const Posts = mongoose.model('Posts', postsSchema)
const Replies = mongoose.model('Replies', repliesSchema)
const Reposts = mongoose.model('Reposts', repostsSchema)
const Likes = mongoose.model('Likes', likesSchema)

module.exports = {
    Posts,
    Replies,
    Reposts,
    Likes
}