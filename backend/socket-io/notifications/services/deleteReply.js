const { Notifications, UnseenNotifications } = require('../../../models/notificationModel')
const { Replies } = require('../../../models/postsModel')
const { ActiveUsers } = require('../../../models/userModel');

const deleteReply = async (data, socket, io) => {
    const { actionID, actorID, targetID } = data

    const replyExists = await Replies.findById(actionID)
    console.log("ReplyExists", replyExists._id)
    console.log("ActionID", actionID)

    if (replyExists) {
        const deletedNotification = await Notifications.findOneAndDelete({ $and: [{ actionID: replyExists._id }, { actorID: actorID }] })

        if (deletedNotification) {
            const unseenNotifications = await UnseenNotifications.findOne({ targetID: deletedNotification.targetID })


            if (unseenNotifications) {
                if (unseenNotifications.unseenNotificationsCount !== 0) {
                    unseenNotifications.unseenNotificationsCount = -1
                    await unseenNotifications.save()
                } else {
                    unseenNotifications.unseenNotificationsCount = 0
                    await unseenNotifications.save()
                }

                console.log("UnseenNotif")

                const isTargetActive = await ActiveUsers.findOne({ userID: unseenNotifications.targetID })

                const updatedNotification = {
                    notification: deletedNotification,
                    unseenNotification: unseenNotifications
                }

                if (isTargetActive) {
                    io.to(isTargetActive.socketID).emit("removeNotification", updatedNotification)
                    console.log("active")
                }
            }
        }

    }


}

module.exports = deleteReply