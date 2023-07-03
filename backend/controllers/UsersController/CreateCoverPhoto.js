const asyncHandler = require('express-async-handler');
const { Users } = require('../../models/userModel');

const CreateCoverPhoto = asyncHandler(async (req, res) => {
    const { userID } = req.params
    const newCoverPhotoURL = req.files.coverPhotoURL
    const userExist = await Users.findById(userID)

    if (userExist) {

        userExist.coverPhotoURL = newCoverPhotoURL[0].path
        await userExist.save()

        res.status(200).json(userExist)
    }
})

module.exports = CreateCoverPhoto