const { Notifications, UnseenNotifications } = require('../../../models/notificationModel')
const { Reposts } = require('../../../models/postsModel')
const { ActiveUsers } = require('../../../models/userModel');

const deleteRepost = async (data, socket, io) => {
    const { actionID, actorID, targetID } = data

    const repostExists = await Reposts.findById(actionID)


    if (repostExists) {
        //    const deletedNotification = await Notifications.findOneAndDelete({ $and: [{ actionID: repostExists._id }, { actorID: actorID }] })
        //     const unseenNotifications = await UnseenNotifications.findOne({ targetID: deletedNotification.targetID })

        //     if (unseenNotifications) {
        //         if (unseenNotifications.unseenNotificationsCount !== 0) {
        //             unseenNotifications.unseenNotificationsCount = -1
        //             await unseenNotifications.save()
        //         } else {
        //             unseenNotifications.unseenNotificationsCount = 0
        //             await unseenNotifications.save()
        //         }


        //         const isTargetActive = await ActiveUsers.findOne({ userID: unseenNotifications.targetID })

        //         const updatedNotification = {
        //             notification: deletedNotification,
        //             unseenNotification: unseenNotifications
        //         }

        //         if (isTargetActive) {
        //             //io.to(isTargetActive.socketID).emit("removeNotification", updatedNotification)
        //         }

        //     }


    }


}

module.exports = deleteRepost