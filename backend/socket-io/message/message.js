const joinConversation = require('./services/joinConversation')
const leaveConversation = require('./services/leaveConversation')
const sendMessage = require('./services/sendMessage')
const createNewMessage = require('./services/createNewMessage')
const openInbox = require('./services/openInbox')


module.exports = (io, socket) => {
    socket.on("joinConversation", (data) => joinConversation(data, socket, io))
    socket.on("leaveConversation", (data) => leaveConversation(data, socket, io))
    socket.on("createNewMessage", (data) => createNewMessage(data, socket, io))
    socket.on("sendMessage", (data) => sendMessage(data, socket, io))
    socket.on("openInbox", (data) => openInbox(data, socket, io))
};
