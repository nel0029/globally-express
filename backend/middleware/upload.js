const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Define the destination directory for uploaded files
    },
    filename: (req, file, cb) => {
        // Generate a unique file name
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage });


module.exports = upload



