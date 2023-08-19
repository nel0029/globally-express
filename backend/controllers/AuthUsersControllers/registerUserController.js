/** @format */

const asyncHandler = require("express-async-handler");
const { Users } = require("../../models/userModel");
const {
  UnseenNotifications,
  UnseenMessages,
} = require("../../models/notificationModel");
const { generateToken } = require("./generateToken");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const {
    userFirstName,
    userMiddleName,
    userLastName,
    userName,
    email,
    password,
    avatarURL,
    coverPhotoURL,
    bio,
  } = req.body;

  if (!userFirstName || !userLastName || !userName || !email || !password) {
    res.status(400).json({ message: "Please add all fields" });
  }
  //Check user existence in database
  const userExists = await Users.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "This user already exist" });
  }

  // Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newCoverPhoto = {
    id: "xfcxo6hhigcb0z8zoqok",
    url: "https://res.cloudinary.com/dedny49m6/image/upload/v1687961548/xfcxo6hhigcb0z8zoqok.jpg",
  };
  const newAvatar = {
    id: "qmf9eubrzyyvewjsmbjq",
    url: "https://res.cloudinary.com/dedny49m6/image/upload/v1688284898/qmf9eubrzyyvewjsmbjq.jpg",
  };
  // Create the User
  const user = await Users.create({
    userFirstName,
    userMiddleName,
    userLastName,
    userName,
    email,
    coverPhotoURL: newCoverPhoto,
    avatarURL: newAvatar,
    bio,
    password: hashedPassword,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user.id,
      userFirstName: user.userFirtName,
      userMiddleName: user.userMiddleName,
      userLastName: user.userLastName,
      userName: user.userName,
      email: user.email,
    });

    await UnseenNotifications.create({
      targetID: user._id,
    });
    await UnseenMessages.create({
      targetID: user._id,
    });
  } else {
    res.status(400).json({ message: "Invalid User Data" });
  }
});

module.exports = {
  registerUser,
};
