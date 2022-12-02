const asyncHandler = require('express-async-handler')
const Products = require('../models/productsModel')
const User = require('../models/userModel')
const { json } = require("express")

// GET All Products
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Products.find()
    res.status(200).json(products)
})

// POST Create new product
const createNewProduct = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)

        throw new Error('Please add some text')
    }

    const product = await Products.create({
        text: req.body.text,
        sellerID: req.user.id
    })
    res.status(200).json(product)
})

// PUT Update a product
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Products.findById(req.params.id)

    if (!product) {
        res.status(400)
        throw new Error('Product not existed')
    }

    const sellerID = await User.findById(req.user.id)

    // Check if seller is existed in database
    if (!sellerID) {
        res.status(401)
        throw new Error('Seller is not found')
    }

    // Check if the logged in user's ID matched the sellerID of the product
    if (product.sellerID.toString() !== sellerID.id) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    const updatedProduct = await Products.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedProduct)
})

// DELETE Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Products.findById(req.params.id)
    if (!product) {
        res.status(400)
        throw new Error('Product not existed')
    }
    const sellerID = await User.findById(req.user.id)

    // Check if seller is existed in database
    if (!sellerID) {
        res.status(401)
        throw new Error('Seller is not found')
    }

    // Check if the logged in user's ID matched the sellerID of the product
    if (product.sellerID.toString() !== sellerID.id) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    await product.remove()
    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
}