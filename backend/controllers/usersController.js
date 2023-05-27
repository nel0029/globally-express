const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


// GET Get user information
const getUserInfo = asyncHandler(async (req, res) => {
    const { _id, userFirstName, email } = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        email,
        userFirstName,
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


module.exports = {
    getUserInfo,
}