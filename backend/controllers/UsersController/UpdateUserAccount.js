/** @format */

const asyncHandler = require("express-async-handler");
const { Users } = require("../../models/userModel");
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
    mediaURLs,
    avatarURL,
    coverPhotoURL,
  } = req.body;

  const userExist = await Users.findById(userID);
  const emailExist = await Users.findOne({ email });

  if (userExist) {
    if (!emailExist || email === userExist.email) {
      let previousAvatarURL = userExist.avatarURL;
      let previousCoverPhotoURL = userExist.coverPhotoURL;

      if (avatarURL) {
        if (
          previousAvatarURL.id !== "qmf9eubrzyyvewjsmbjq" &&
          previousAvatarURL.id !== process.env.AVATAR_DEFAULT_ID
        ) {
          await cloudinary.uploader.destroy(userExist.avatarURL.id);
          userExist.avatarURL = avatarURL;
          await userExist.save();
        } else {
          userExist.avatarURL = avatarURL;
          await userExist.save();
        }
      }

      if (coverPhotoURL) {
        if (
          previousCoverPhotoURL.id !== "xfcxo6hhigcb0z8zoqok" &&
          previousCoverPhotoURL.id !== process.env.COVERPHOTO_DEFAULT_ID
        ) {
          await cloudinary.uploader.destroy(userExist.coverPhotoURL.id);
          userExist.coverPhotoURL = coverPhotoURL;
          await userExist.save();
        } else {
          userExist.coverPhotoURL = coverPhotoURL;
          await userExist.save();
        }
      }

      if (userName && userName !== userExist.userName) {
        userExist.userName = userName;
        await userExist.save();
      }
      if (email) {
        email && (userExist.email = email);
        await userExist.save();
      }

      if (userFirstName) {
        userFirstName && (userExist.userFirstName = userFirstName);
        await userExist.save();
      }
      if (userMiddleName) {
        userMiddleName && (userExist.userMiddleName = userMiddleName);
        await userExist.save();
      }

      if (userLastName) {
        userLastName && (userExist.userLastName = userLastName);
        await userExist.save();
      }

      if (bio) {
        bio && (userExist.bio = bio);
        await userExist.save();
      }

      if (newPassword) {
        if (await bcrypt.compare(currentPassword, userExist.password)) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          userExist.password = hashedPassword;
        }
      }

      await userExist.save();

      const existingData = {
        userFirstName: userExist.userFirstName,
        userMiddleName: userExist.userMiddleName,
        userLastName: userExist.userLastName,
        userName: userExist.userName,
        bio: userExist.bio,
        email: userExist.email,
        avatarURL: userExist.avatarURL,
        coverPhotoURL: userExist.coverPhotoURL,
      };
      res.status(200).json(existingData);
    } else {
      res.status(401).json({ message: "Email already taken" });
    }
  }
});

module.exports = UpdateUserAccount;
