const { UnseenNotifications } = require('../../models/notificationModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const readUnseenNotification = asyncHandler(async (req, res) => {
    const { userID } = req.params

    if (userID) {
        const unseenNotifications = await UnseenNotifications.findOne({ targetID: userID })

        res.status(200).json(unseenNotifications)
    }
})

module.exports = readUnseenNotification