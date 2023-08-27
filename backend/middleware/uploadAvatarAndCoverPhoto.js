/** @format */

const uploadFiles = require("./uploadFiles");
const uploadToCloudinary = require("./Utils/uploadToCloudinary");

const uploadAvatarAndCoverPhoto = async (req, res, next) => {
  const mediaURLs = [];
  if (req.files) {
    if (req.files["avatarURL"] && req.files["avatarURL"][0]) {
      const file = req.files["avatarURL"][0];
      const newAvatarURL = await uploadToCloudinary(
        file,
        "globally/profile-pictures"
      );
      mediaURLs.push(newAvatarURL);
    }

    if (req.files["coverPhotoURL"] && req.files["coverPhotoURL"][0]) {
      const file = req.files["coverPhotoURL"][0];
      const newAvatarURL = await uploadToCloudinary(
        file,
        "globally/cover-photos"
      );
      mediaURLs.push(newAvatarURL);
    }

    req.body.mediaURLs = mediaURLs;

    next();
  } else {
    console.log("No file is found");
    next();
  }
};

module.exports = uploadAvatarAndCoverPhoto;
