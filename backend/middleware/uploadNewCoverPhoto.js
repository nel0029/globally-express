const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Set the destination folder to 'public'

    },
    filename: (req, file, cb) => {
        // Generate a unique file name
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });

const uploadNewCoverPhoto = upload.single('coverPhotoURL');

module.exports = uploadNewCoverPhoto;
