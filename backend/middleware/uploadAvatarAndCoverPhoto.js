/** @format */

const uploadFiles = require("./uploadFiles");
const uploadToCloudinary = require("./Utils/uploadToCloudinary");

const uploadAvatarAndCoverPhoto = async (req, res, next) => {
  const mediaURLs = [];
  let avatarURL;
  let coverPhotoURL;
  if (req.files) {
    if (req.files["avatarURL"] && req.files["avatarURL"][0]) {
      const file = req.files["avatarURL"][0];
      const newAvatarURL = await uploadToCloudinary(
        file,
        "globally/profile-pictures"
      );
      req.body.avatarURL = newAvatarURL;
      //mediaURLs.push(newAvatarURL);
    }

    if (req.files["coverPhotoURL"] && req.files["coverPhotoURL"][0]) {
      const file = req.files["coverPhotoURL"][0];
      const newCoverPhotoURL = await uploadToCloudinary(
        file,
        "globally/cover-photos"
      );
      req.body.coverPhotoURL = newCoverPhotoURL;
    }

    next();
  } else {
    console.log("No file is found");
    next();
  }
};

module.exports = uploadAvatarAndCoverPhoto;
