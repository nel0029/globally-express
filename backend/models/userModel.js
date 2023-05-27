const mongoose = require('mongoose')
const moment = require('moment-timezone');



const userSchema = new mongoose.Schema({
    userFirstName: {
        type: String,
        required: true,
    },
    userMiddleName: {
        type: String,
    },
    userLastName: {
        type: String,
        required: true,
    },

    userName: {
        type: String,
        unique: true
    },

    avatarURL: {
        type: String
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    privacy: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    })

userSchema.pre('save', function (next) {
    // Convert createdAt to "Asia/Manila" timezone
    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});



const followingSchema = new mongoose.Schema({
    followedID: String,
    followerID: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    }
)

followingSchema.pre('save', function (next) {
    // Convert createdAt to "Asia/Manila" timezone
    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});


const Users = mongoose.model('User', userSchema)
const Following = mongoose.model('Following', followingSchema)

module.exports = {
    Users,
    Following
}

