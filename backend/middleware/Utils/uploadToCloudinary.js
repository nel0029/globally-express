/** @format */

const cloudinary = require("../../utils/cloudinary");
const fs = require("fs");

const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      {
        folder: folder,
      },
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Uploading File failed" });
          reject(error);
        } else {
          fs.unlinkSync(file.path);
          resolve({
            fieldname: file.fieldname,
            url: result.secure_url,
            id: result.public_id,
          });
        }
      }
    );
  });
};

module.exports = uploadToCloudinary;
