const mongoose = require('mongoose');
const { Users } = require('./userModel')
const moment = require('moment-timezone');
const { ObjectId } = require('mongodb');


const contactListSchema = mongoose.Schema({
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },

    contactID: {
        type: mongoose.Schema.Types.ObjectId,
    },

    conversationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations"
    },

    type: {
        type: String
    },

    lastMessageTimeStamps: {
        type: Date,
    },

    lastMessageID: {
        type: mongoose.Schema.Types.ObjectId,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

},
    {
        timestamps: true
    }
)



contactListSchema.pre('save', function (next) {

    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});




const groupChatsSchema = mongoose.Schema({
    name: {
        type: String
    },
    groupPhotoURL: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

},
    {
        timestamps: true
    }
)



groupChatsSchema.pre('save', function (next) {

    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});



const groupChatMembersSchema = mongoose.Schema({
    role: {
        type: String
    },
    memberID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    groupChatID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupChats"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    })



groupChatMembersSchema.pre('save', function (next) {

    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});


const messagesSchema = mongoose.Schema({

    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },

    conversationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations"
    },

    type: {
        type: String
    },

    text: {
        type: String
    },


    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    })


messagesSchema.pre('save', function (next) {

    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});





const conversationRequestsSchema = mongoose.Schema({
    requesterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },

    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },

    conversationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations"
    },

    type: {
        type: String
    },

    unseenMessagesCount: {
        type: Number
    },

    lastMessageTimestamps: {
        type: Date,
    },

    lastMessageID: {
        type: mongoose.Schema.Types.ObjectId,
    },

    lastMessage: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    })


conversationRequestsSchema.pre('save', function (next) {

    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});




const conversationSchema = mongoose.Schema({

    type: {
        type: String
    },

    lastMessageTimestamps: {
        type: Date,
    },

    lastMessageID: {
        type: mongoose.Schema.Types.ObjectId,
    },

    lastMessage: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

},
    {
        timestamps: true
    }
)


conversationSchema.pre('save', function (next) {

    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});


const conversationMembersSchema = mongoose.Schema({
    conversationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations"
    },

    unseenMessagesCount: {
        type: Number
    },

    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },

    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },


    isActive: {
        type: Boolean
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    })

conversationMembersSchema.pre('save', function (next) {

    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});


const unseenMessagesCountSchema = mongoose.Schema({
    tragetID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    unseenMessagesCount: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    })


unseenMessagesCountSchema.pre('save', function (next) {

    this.createdAt = moment(this.createdAt).tz('Asia/Manila');
    next();
});



const ContactLists = mongoose.model('ContactLists', contactListSchema)
const GroupChats = mongoose.model('GroupChats', groupChatsSchema)
const GroupChatMembers = mongoose.model('GroupChatMember', groupChatMembersSchema)
const Messages = mongoose.model('Messages', messagesSchema)
const Conversations = mongoose.model('Conversations', conversationSchema)
const ConversationMembers = mongoose.model('ConversationMembers', conversationMembersSchema)
const ConversationRequests = mongoose.model('ConversationRequests', conversationRequestsSchema)
//const UnseenMessagesCount = mongoose.model("UnseenMessagesCount", unseenMessagesCountSchema)


module.exports = {
    ContactLists,
    GroupChats,
    GroupChatMembers,
    Messages,
    Conversations,
    ConversationMembers,
    ConversationRequests,
    // UnseenMessagesCount
}