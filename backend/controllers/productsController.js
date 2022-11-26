const asyncHandler = require('express-async-handler')
const Products = require('../models/productsModel')
const { json } = require("express")

// GET All Products
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Products.find({ user: req.user.id })
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
        user: req.user.id
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

    await product.remove()
    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
}