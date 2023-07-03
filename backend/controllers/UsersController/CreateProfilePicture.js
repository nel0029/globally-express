const asyncHandler = require('express-async-handler');
const { Users } = require('../../models/userModel');

const CreateProfilePicture = asyncHandler(async (req, res) => {
    const { userID } = req.body
    const newAvatarURL = req.files.avatarURL
    const userExist = await Users.findById(userID)

    if (userExist) {

        userExist.avatarURL = newAvatarURL[0].path
        await userExist.save()

        res.status(200).json(userExist)
    }
})

module.exports = CreateProfilePicture