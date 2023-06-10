const mongoose = require('mongoose')
const { Users } = require('./userModel')
const moment = require('moment-timezone');
const { ObjectId } = require('mongodb');


const postsSchema = mongoose.Schema({

    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    type: String,
    privacy: String,
    caption: String,
    mediaURL: [String],
    likesCount: Number,
    repliesCount: Number,
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

    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    type: String,
    parentPostID: ObjectId,
    parentAuthorID: ObjectId,
    parentType: String,
    privacy: String,
    caption: String,
    mediaURL: [String],
    likesCount: Number,
    repliesCount: Number,
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

    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    type: String,
    parentPostID: ObjectId,
    parentAuthorID: ObjectId,
    parentType: String,
    privacy: String,
    caption: String,
    mediaURL: [String],
    likesCount: Number,
    repliesCount: Number,
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
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    type: String,
    parentPostID: ObjectId,
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