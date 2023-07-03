const cloudinary = require('../utils/cloudinary');
const upload = require('./upload');
const fs = require('fs');

const uploadProfilePicture = async (req, res, next) => {
    try {
        await upload.single('avatarURL')(req, res, async (err) => {
            if (err) {
                // Handle multer upload error
                return res.status(500).json({ error: 'Failed to upload file' });
            }

            // If file uploaded successfully, upload it to Cloudinary
            if (req.file) {
                const file = req.file;

                // Upload file to Cloudinary
                const uploadResult = await cloudinary.uploader.upload(file.path);

                // Remove the temporary file
                fs.unlinkSync(file.path);

                // Merge the Cloudinary details with the existing req.body object
                req.body = {
                    ...req.body,
                    avatar: {
                        url: uploadResult.secure_url,
                        id: uploadResult.public_id,
                    },
                };
            }

            next();
        });
    } catch (err) {
        // Handle any errors
        return res.status(500).json({ error: 'Failed to upload file' });
    }
};

module.exports = uploadProfilePicture;
