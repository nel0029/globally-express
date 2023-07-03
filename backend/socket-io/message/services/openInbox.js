const { UnseenMessages } = require('../../../models/notificationModel')
const { ActiveUsers } = require('../../../models/userModel');

const openInbox = async (data, socket, io) => {
    const { userID } = data

    const messageNotification = await UnseenMessages.findOne({ targetID: userID })
    const isUserActive = await ActiveUsers.findOne({ userID: userID })

    if (messageNotification) {
        messageNotification.unseenMessagesCount = -1
        await messageNotification.save()

        if (isUserActive) {
            io.to(isUserActive.socketID).emit("opneInbox", messageNotification)
        }
    }

}

module.exports = openInbox