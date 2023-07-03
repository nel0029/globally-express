const asyncHandler = require('express-async-handler');
const { Users } = require('../../models/userModel');
const fs = require('fs');
const path = require('path');


const UpdateProfilePicture = asyncHandler(async (req, res) => {
    const { userID } = req.body
    const newAvatarURL = req.files.avatarURL
    const userExist = await Users.findById(userID)



    if (userExist) {
        const previousAvatarURL = userExist.avatarURL;
        const fullPath = path.join(__dirname, '../../../', previousAvatarURL.replace(/[\\/]/g, '/'));

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        userExist.avatarURL = newAvatarURL[0].path
        await userExist.save()

        res.status(200).json(userExist)
    }
})

module.exports = UpdateProfilePicture