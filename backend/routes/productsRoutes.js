const express = require('express')
const router = express.Router()
const {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productsController')


router.route('/').get(getAllProducts).post(createNewProduct)
router.route('/:id').put(updateProduct).delete(deleteProduct)

module.exports = router