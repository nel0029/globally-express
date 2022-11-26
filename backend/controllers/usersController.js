const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { use } = require('../routes/productsRoutes')

// POST Register a User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }
    //Check user existence in database
    const userExists = User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('Email is already used by other user')
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create the User
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

// POST Login a User
const logInUser = asyncHandler(async (req, res) => {

})

// GET Get user information
const getUserInfo = asyncHandler(async (req, res) => {

})


module.exports = {
    registerUser,
    logInUser,
    getUserInfo,
}