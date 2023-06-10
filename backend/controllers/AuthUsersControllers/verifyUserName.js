const asyncHandler = require('express-async-handler')
const { Users } = require('../../models/userModel')

const verifyUserName = asyncHandler(async (req, res) => {
    const userName = req.query.userName


    const userNameExists = await Users.findOne({ userName: userName })

    if (userNameExists && userName.length !== 0) {
        res.status(409).json({
            message: "This username is already taken",
            valid: false
        })
    } else {
        res.status(200).json({
            message: "This username is available",
            valid: true
        })
    }
})

module.exports = verifyUserName