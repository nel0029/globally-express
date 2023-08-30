/** @format */

const like = require("./services/like");
const unlike = require("./services/unlike");
const createReply = require("./services/createReply");
const createRepost = require("./services/createRepost");
const deleteReply = require("./services/deleteReply");
const deleteRepost = require("./services/deleteRepost");
const resetNotificationsCount = require("./services/resetNotificationsCount");
const createNewNotication = require("./services/createNewNotification");
const deleteNotification = require("./services/deleteNotification");

module.exports = (io, socket) => {
  socket.on("newLike", (data) => like(data, socket, io));
  socket.on("newReply", (data) => createReply(data, socket, io));
  socket.on("newRepost", (data) => createRepost(data, socket, io));
  socket.on("unlike", (data) => unlike(data, socket, io));
  socket.on("deleteReply", (data) => deleteReply(data, socket, io));
  socket.on("deleteRepost", (data) => deleteRepost(data, socket, io));
  socket.on("resetNotificationsCount", (data) =>
    resetNotificationsCount(data, socket, io)
  );
  socket.on("createNewNotification", (data) =>
    createNewNotication(data, socket, io)
  );
  socket.on("deleteNotification", (data) =>
    deleteNotification(data, socket, io)
  );
};
