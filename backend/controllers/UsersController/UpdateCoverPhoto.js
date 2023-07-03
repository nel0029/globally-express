const asyncHandler = require('express-async-handler');
const { Users } = require('../../models/userModel');
const fs = require('fs');
const path = require('path');


const UpdateCoverPhoto = asyncHandler(async (req, res) => {
    const { userID } = req.body
    const newCoverPhotoURL = req.files.coverPhotoURL
    const userExist = await Users.findById(userID)


    if (userExist) {
        const previousCoverPhotoURL = userExist.coverPhotoURL;
        const fullPath = path.join(__dirname, '../../../', previousCoverPhotoURL.replace(/[\\/]/g, '/'));

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        userExist.coverPhotoURL = newCoverPhotoURL[0].path
        await userExist.save()

        res.status(200).json(userExist)
    }
})

module.exports = UpdateCoverPhoto