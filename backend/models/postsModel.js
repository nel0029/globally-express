/** @format */

const mongoose = require("mongoose");
const { Users } = require("./userModel");
const moment = require("moment-timezone");
const { ObjectId } = require("mongodb");

const postsSchema = mongoose.Schema(
  {
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    type: String,
    privacy: String,
    caption: String,
    mediaURL: [
      {
        id: String,
        url: String,
      },
    ],
    hasPoll: {
      type: Boolean,
    },
    bgColor: {
      type: String,
    },

    likesCount: Number,
    repliesCount: Number,
    repostsCount: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

postsSchema.pre("save", function (next) {
  // Convert createdAt to "Asia/Manila" timezone
  this.createdAt = moment(this.createdAt).tz("Asia/Manila");
  next();
});

const repliesSchema = mongoose.Schema(
  {
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    type: String,
    parentPostID: ObjectId,
    parentAuthorID: ObjectId,
    parentType: String,
    privacy: String,
    caption: String,
    mediaURL: [
      {
        id: String,
        url: String,
      },
    ],

    likesCount: Number,
    repliesCount: Number,
    repostsCount: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

repliesSchema.pre("save", function (next) {
  // Convert createdAt to "Asia/Manila" timezone
  this.createdAt = moment(this.createdAt).tz("Asia/Manila");
  next();
});

const repostsSchema = mongoose.Schema(
  {
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    type: String,
    parentPostID: ObjectId,
    parentAuthorID: ObjectId,
    parentType: String,
    privacy: String,
    caption: String,
    mediaURL: [
      {
        id: String,
        url: String,
      },
    ],

    likesCount: Number,
    repliesCount: Number,
    repostsCount: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

repostsSchema.pre("save", function (next) {
  // Convert createdAt to "Asia/Manila" timezone
  this.createdAt = moment(this.createdAt).tz("Asia/Manila");
  next();
});

const likesSchema = mongoose.Schema(
  {
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    parentAuthorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    type: String,
    parentPostID: ObjectId,
    parentType: String,
    privacy: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

likesSchema.pre("save", function (next) {
  // Convert createdAt to "Asia/Manila" timezone
  this.createdAt = moment(this.createdAt).tz("Asia/Manila");
  next();
});

const pollOptionsSchema = mongoose.Schema({
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
  body: String,
});

const pollRespondentsSchema = mongoose.Schema({
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
  respondentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  optionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PollOptions",
  },
});

const hashtagsSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    postID: {
      type: ObjectId,
    },
    postType: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

hashtagsSchema.pre("save", function (next) {
  // Convert createdAt to "Asia/Manila" timezone
  this.createdAt = moment(this.createdAt).tz("Asia/Manila");
  next();
});

const searchedWords = mongoose.Schema(
  {
    name: {
      type: String,
    },
    userID: {
      type: ObjectId,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

searchedWords.pre("save", function (next) {
  // Convert createdAt to "Asia/Manila" timezone
  this.createdAt = moment(this.createdAt).tz("Asia/Manila");
  next();
});

const Posts = mongoose.model("Posts", postsSchema);
const Replies = mongoose.model("Replies", repliesSchema);
const Reposts = mongoose.model("Reposts", repostsSchema);
const Likes = mongoose.model("Likes", likesSchema);
const PollOptions = mongoose.model("PollOptions", pollOptionsSchema);
const PollRespondents = mongoose.model(
  "PollRespondents",
  pollRespondentsSchema
);
const Hashtags = mongoose.model("Hashtags", hashtagsSchema);
const SearchedWords = mongoose.model("SearchedWords", searchedWords);

module.exports = {
  Posts,
  Replies,
  Reposts,
  Likes,
  PollOptions,
  PollRespondents,
  Hashtags,
  SearchedWords,
};
