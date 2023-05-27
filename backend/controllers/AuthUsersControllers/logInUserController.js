const asyncHandler = require('express-async-handler')
const { Users } = require('../../models/userModel')
const bcrypt = require('bcryptjs')
const { generateToken } = require('./generateToken')


const logInUser = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body

    const user = await Users.findOne({ userName })
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            userID: user._id,
            userName: user.userName,
            avatarURL: user.avatarURL,
            userFirstName: user.userFirstName,
            userMiddleName: user.userMiddleName,
            userLastName: user.userLastName,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

module.exports = { logInUser }