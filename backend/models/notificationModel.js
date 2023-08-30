/** @format */

const mongoose = require("mongoose");
const { Users } = require("./userModel");
const moment = require("moment-timezone");
const { ObjectId } = require("mongodb");

const notificationsSchema = mongoose.Schema(
  {
    actionType: {
      type: String,
    },
    postID: {
      type: mongoose.Schema.Types.ObjectId,
    },

    postType: {
      type: String,
    },

    actionID: {
      type: mongoose.Schema.Types.ObjectId,
    },

    actorID: {
      type: mongoose.Schema.Types.ObjectId,
    },
    targetID: {
      type: mongoose.Schema.Types.ObjectId,
    },
    seen: {
      type: Boolean,
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

notificationsSchema.pre("save", function (next) {
  this.createdAt = moment(this.createdAt).tz("Asia/Manila");
  next();
});

const unseenNotificationsSchema = mongoose.Schema(
  {
    targetID: {
      type: mongoose.Schema.Types.ObjectId,
    },

    unseenNotificationsCount: {
      type: Number,
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

unseenNotificationsSchema.pre("save", function (next) {
  this.createdAt = moment(this.createdAt).tz("Asia/Manila");
  next();
});

const unseenMessagesSchema = mongoose.Schema(
  {
    targetID: {
      type: mongoose.Schema.Types.ObjectId,
    },
    unseenMessagesCount: {
      type: Number,
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

unseenMessagesSchema.pre("save", function (next) {
  this.createdAt = moment(this.createdAt).tz("Asia/Manila");
  next();
});

const Notifications = mongoose.model("Notifications", notificationsSchema);
const UnseenNotifications = mongoose.model(
  "UnseenNotifications",
  unseenNotificationsSchema
);
const UnseenMessages = mongoose.model("UnseenMessages", unseenMessagesSchema);

module.exports = { Notifications, UnseenNotifications, UnseenMessages };
