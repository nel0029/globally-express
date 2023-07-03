const cloudinary = require('../utils/cloudinary');
const upload = require('./upload');
const fs = require('fs');

const uploadMiddleware = (req, res, next) => {
    upload.any()(req, res, (err) => {
        if (err) {
            // Handle Multer error
            return res.status(500).json({ error: 'Failed to upload file' });
        }

        // If files uploaded successfully, upload each file to Cloudinary
        if (req.files && req.files.length > 0) {
            const files = req.files;
            const mediaURLs = []; // Array to store the file URLs

            // Process each file and upload to Cloudinary
            const uploadPromises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    // Upload file to Cloudinary
                    cloudinary.uploader.upload(file.path, (error, result) => {
                        if (error) {
                            // Handle Cloudinary upload error
                            reject('Failed to upload file to Cloudinary');
                        }

                        const img = {
                            url: result.secure_url,
                            id: result.public_id,
                        };
                        // Store the Cloudinary URL in the mediaURLs array
                        mediaURLs.push(img);

                        // Remove the temporary file
                        fs.unlinkSync(file.path);

                        resolve();
                    });
                });
            });

            // Wait for all uploads to complete
            Promise.all(uploadPromises)
                .then(() => {
                    // Store the file URLs in req.body or req.file for further processing
                    req.body.mediaURLs = mediaURLs;

                    next();
                })
                .catch((error) => {
                    // Handle any upload errors
                    res.status(500).json({ error });
                });
        } else {
            next();
        }
    });
};

module.exports = uploadMiddleware;
