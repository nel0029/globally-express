const asyncHandler = require('express-async-handler')
const { json } = require("express")

// GET All Products
const getAllProducts = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "All Products" })
})

// POST Create new product
const createNewProduct = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)

        throw new Error('Please add some text')
    }
    res.status(200).json({ message: "Product Posted" })
})

// PUT Update a product
const updateProduct = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Product ${req.params.id} has been updated` })
})

// DELETE Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Product ${req.params.id} has been deleted` })
})

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
}