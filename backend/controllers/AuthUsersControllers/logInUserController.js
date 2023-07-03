const asyncHandler = require('express-async-handler');
const { Users } = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('./generateToken');

const basePath = process.env.BASE_PATH;

const logInUser = asyncHandler(async (req, res) => {
    const { logInID, password } = req.body;

    const user = await Users.findOne({
        $or: [{ userName: logInID }, { email: logInID }],
    });



    if (user && (await bcrypt.compare(password, user.password))) {

        res.status(200).json({
            userID: user._id,
            userName: user.userName,
            avatarURL: user.avatarURL,
            userFirstName: user.userFirstName,
            userMiddleName: user.userMiddleName,
            userLastName: user.userLastName,
            coverPhotoURL: user.coverPhotoURL,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: "Account did not exists or Invalid Email, Username and Password" });

    }
});

module.exports = { logInUser };
