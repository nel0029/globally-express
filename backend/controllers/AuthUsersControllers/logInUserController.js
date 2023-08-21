/** @format */

const asyncHandler = require("express-async-handler");
const { Users } = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("./generateToken");

const logInUser = asyncHandler(async (req, res) => {
  const { logInID, password } = req.body;

  const user = await Users.findOne({
    $or: [{ userName: logInID }, { email: logInID }],
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user._id);
    res.status(200).json({
      userID: user._id,
      userName: user.userName,
      avatarURL: user.avatarURL.url,
      coverPhotoURL: user.coverPhotoURL.url,
      userFirstName: user.userFirstName,
      userMiddleName: user.userMiddleName,
      userLastName: user.userLastName,
      bio: user.bio,
      verified: user.verified,
      isLogIn: true,
    });
  } else {
    res.status(400).json({
      message: "Account did not exists or Invalid Email, Username and Password",
    });
  }
});

module.exports = { logInUser };
