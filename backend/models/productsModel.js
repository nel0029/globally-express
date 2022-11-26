const mongoose = require('mongoose')

const productsSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Products', productsSchema)