const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({

    slug: {
        type: String,
        required: false,
        unique: false
    },
    shop_name: {
        type: String,
        required: true,
    },
    shop_phone_number: {
        type: String,
        required: true,
    },
    shop_category: {
        type: String,
        required: true,
    },
    shop_description: {
        type: String,
        required: true,
    },
    shop_address: {
        type: String,
        required: true,
    },
    min_order: {
        type: Number,
        required: true,
    },
    main_banner: {
        type: String,
        required: false,
    },
    product_banner: {
        type: String,
        required: false,
    },
    product_features: {
        type: String,
        required: false,
    },
    links: [],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
