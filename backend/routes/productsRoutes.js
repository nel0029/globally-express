const express = require('express')
const router = express.Router()
const {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productsController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getAllProducts).post(protect, createNewProduct)
router.route('/:id').put(protect, updateProduct).delete(protect, deleteProduct)

module.exports = router