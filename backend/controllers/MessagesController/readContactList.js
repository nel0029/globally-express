const asyncHandler = require('express-async-handler')
const { Users } = require('../../models/userModel')
const { ContactLists } = require('../../models/messageModel');
const { ObjectId } = require('mongodb');



const readContactList = asyncHandler(async (req, res) => {

    const { userID } = req.query

    const contacts = await ContactLists.aggregate([
        {
            $match: {
                ownerID: new ObjectId(userID)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "ownerID",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "contactID",
                foreignField: "_id",
                as: "contact"
            }
        },
        {
            $addFields: {
                contactUserName: { $arrayElemAt: ['$contact.userName', 0] },
                contactFirstName: { $arrayElemAt: ['$contact.userFirstName', 0] },
                contactMiddleName: { $arrayElemAt: ['$contact.userMiddleName', 0] },
                contactLastName: { $arrayElemAt: ['$contact.userLastName', 0] },
                contactAvatarURL: { $arrayElemAt: ['$contact.avatarURL', 0] },
            }
        },
        {
            $project: {
                _id: 1,
                ownerID: 1,
                contactID: 1,
                contactUserName: 1,
                contactFirstName: 1,
                contactMiddleName: 1,
                contactLastName: 1,
                contactAvatarURL: 1
            }
        }

    ])

    res.status(200).json(contacts)
})

module.exports = readContactList