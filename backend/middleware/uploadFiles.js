/** @format */

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "avatarURL") {
      cb(null, path.join(__dirname, "../uploads/profile-pictures"));
    } else if (file.fieldname === "coverPhotoURL") {
      cb(null, path.join(__dirname, "../uploads/cover-photos"));
    } else {
      cb(null, path.join(__dirname, "../uploads/media"));
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "avatarURL") {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    } else if (file.fieldname === "coverPhotoURL") {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    } else {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
  },
});

const uploadFiles = multer({ storage });

module.exports = uploadFiles;
