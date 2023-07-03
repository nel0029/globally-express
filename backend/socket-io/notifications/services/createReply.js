const { Notifications, UnseenNotifications } = require('../../../models/notificationModel')
const { Replies } = require('../../../models/postsModel')
const { ActiveUsers } = require('../../../models/userModel');

const createReply = async (data, socket, io) => {
    const { actionType, actionID, postID, postType, actorID, targetID } = data

    const replyExists = await Replies.findById(actionID)

    if (replyExists) {
        const newNotification = await Notifications.create({
            actionType: actionType,
            postID: postID,
            actionID: replyExists._id,
            postType: postType,
            actorID: actorID,
            targetID: targetID
        })

        const isTargetActive = await ActiveUsers.findOne({ userID: newNotification.targetID })

        const unseenNotificationExists = await UnseenNotifications.findOne({ targetID: newNotification.targetID })

        const targetNotifications = await Notifications.aggregate([
            {
                $match: {
                    _id: newNotification._id,
                    targetID: newNotification.targetID
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "actorID",
                    foreignField: "_id",
                    as: "actor"
                }
            },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    actionType: 1,
                    actorID: 1,
                    actionID: 1,
                    targetID: 1,
                    postID: 1,
                    postType: 1,
                    actorUserName: { $arrayElemAt: ["$actor.userName", 0] },
                    actorAvatarURL: { $arrayElemAt: ["$actor.avatarURL", 0] }
                }
            }

        ])

        if (unseenNotificationExists) {

            unseenNotificationExists.unseenNotificationsCount = +1
            await unseenNotificationExists.save()


            const notifications = {
                notification: targetNotifications[0],
                unseenNotification: unseenNotificationExists
            }

            if (isTargetActive) {
                io.to(isTargetActive.socketID).emit("newNotification", notifications)
            }

        } else {
            const newUnseenNotication = await UnseenNotifications.create({
                unseenNotificationsCount: +1,
                targetID: newNotification.targetID
            })

            const notifications = {
                notification: targetNotifications[0],
                unseenNotification: newUnseenNotication
            }

            if (isTargetActive) {
                io.to(isTargetActive.socketID).emit("newNotification", notifications)
            }
            console.log("Delete Reply")
        }
        console.log("New Reply")
    }

}

module.exports = createReply