/** @format */

const asyncHandler = require("express-async-handler");
const { Users } = require("../../models/userModel");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const cloudinary = require("../../utils/cloudinary");

const UpdateUserAccount = asyncHandler(async (req, res) => {
  const {
    userID,
    email,
    userName,
    userFirstName,
    userMiddleName,
    userLastName,
    bio,
    currentPassword,
    newPassword,
    avatar,
    coverPhoto,
  } = req.body;

  const userExist = await Users.findById(userID);

  if (userExist) {
    if (await bcrypt.compare(currentPassword, userExist.password)) {
      let previousAvatarURL = userExist.avatarURL;
      let previousCoverPhotoURL = userExist.coverPhotoURL;

      if (previousAvatarURL) {
        if (previousAvatarURL.id !== "qmf9eubrzyyvewjsmbjq") {
          await cloudinary.uploader.destroy(userExist.avatarURL.id);
        }
      }

      if (previousCoverPhotoURL) {
        if (previousCoverPhotoURL.id !== "xfcxo6hhigcb0z8zoqok") {
          await cloudinary.uploader.destroy(userExist.coverPhotoURL.id);
        }
      }

      avatar && (userExist.avatarURL = avatar);
      coverPhoto && (userExist.coverPhotoURL = coverPhoto);
      userName && (userExist.userName = userName);
      email && (userExist.email = email);
      userFirstName && (userExist.userFirstName = userFirstName);
      userMiddleName && (userExist.userMiddleName = userMiddleName);
      userLastName && (userExist.userLastName = userLastName);
      bio && (userExist.bio = bio);

      if (newPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        userExist.password = hashedPassword;
      }

      await userExist.save();

      res.status(200).json(userExist);
    } else {
      res.status(400).json({ message: "Incorrect Password" });
    }
  }
});

module.exports = UpdateUserAccount;
