/** @format */

const cloudinary = require("../utils/cloudinary");
const uploadFiles = require("./uploadFiles");
const fs = require("fs");

const uploadMiddleware = (req, res, next) => {
  uploadFiles.single("file")(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to upload file" }, "Error: ", err);
    }

    // If file uploaded successfully, upload the file to Cloudinary
    if (req.file) {
      const file = req.file;

      // Upload file to Cloudinary
      cloudinary.uploader.upload(
        file.path,
        {
          folder: "globally/media-files",
        },
        (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Failed to upload file to Cloudinary" });
          }

          // Create an object with Cloudinary URL and public_id
          const mediaURL = {
            url: result.secure_url,
            id: result.public_id,
          };

          // Remove the temporary file
          fs.unlinkSync(file.path);

          // Check if mediaURLs array exists in req.body, and initialize it if not
          if (!req.body.mediaURLs) {
            req.body.mediaURLs = [];
          }

          // Push the Cloudinary URL to the mediaURLs array
          req.body.mediaURLs.push(mediaURL);

          next();
        }
      );
    } else {
      next();
    }
  });
};

module.exports = uploadMiddleware;
