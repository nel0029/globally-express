const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { Users } = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await Users.findById(decoded.id).select('-password');

            next();
        } catch (error) {

            res.status(401).json({ message: "Not authorized" });

        }
    }

    if (!token) {
        res.status(401);
        throw new Error('No token generated because you are not authorized');
    }
});


module.exports = {
    protect,
};
