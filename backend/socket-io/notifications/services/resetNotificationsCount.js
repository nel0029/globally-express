const { Notifications, UnseenNotifications } = require('../../../models/notificationModel')
const { ActiveUsers } = require('../../../models/userModel');


const resetNotificationsCount = async (data, socket, io) => {

    const { userID } = data

    const notificationExists = await UnseenNotifications.findOne({ targetID: userID })

    if (notificationExists) {
        notificationExists.unseenNotificationsCount = 0

        await notificationExists.save()

        const isUserActive = await ActiveUsers.findOne({ userID: notificationExists.targetID })

        if (isUserActive) {
            io.to(isUserActive.socketID).emit("resetnotificationsCount", notificationExists)
        }
    }
}

module.exports = resetNotificationsCount