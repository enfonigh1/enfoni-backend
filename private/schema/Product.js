const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_catgory: [],
    product_images: [],
    product_description: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    tags: {
        type: String,
        required: true
    },
    regular_price: {
        type: Number,
        required: true
    },
    sales_price: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }

}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);


