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
  } = req.body;

  const userExist = await Users.findById(userID);
  const emailExist = await Users.findOne({ email });

  if (userExist) {
    if (!emailExist || email === userExist.email) {
      let previousAvatarURL = userExist.avatarURL;
      let previousCoverPhotoURL = userExist.coverPhotoURL;

      if (mediaURLs && mediaURLs.length > 0) {
        const avatar = mediaURLs.filter((img) => img.fieldname === "avatarURL");
        const coverPhoto = mediaURLs.filter(
          (img) => img.fieldname === "coverPhotoURL"
        );
        if (avatar[0]) {
          const newAvatar = avatar.map((img) => ({ url: img.url, id: img.id }));

          if (
            previousAvatarURL.id !== "qmf9eubrzyyvewjsmbjq" &&
            previousAvatarURL.id !== process.env.AVATAR_DEFAULT_ID
          ) {
            await cloudinary.uploader.destroy(userExist.avatarURL.id);
            userExist.avatarURL = newAvatar[0];
            await userExist.save();
          } else {
            userExist.avatarURL = newAvatar[0];
            await userExist.save();
          }
        }

        if (coverPhoto[0]) {
          const newCoverPhoto = coverPhoto.map((img) => ({
            url: img.url,
            id: img.id,
          }));

          if (
            previousCoverPhotoURL.id !== "xfcxo6hhigcb0z8zoqok" &&
            previousCoverPhotoURL.id !== process.env.COVERPHOTO_DEFAULT_ID
          ) {
            await cloudinary.uploader.destroy(userExist.coverPhotoURL.id);
            userExist.coverPhotoURL = newCoverPhoto[0];
            await userExist.save();
          } else {
            userExist.coverPhotoURL = newCoverPhoto[0];
            await userExist.save();
          }
        }
      } else {
        userExist.avatarURL = previousAvatarURL;
        userExist.coverPhotoURL = previousCoverPhotoURL;
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

      res.status(200).json(userExist);
    } else {
      res.status(401).json({ message: "Email already taken" });
    }
  }
});

module.exports = UpdateUserAccount;
