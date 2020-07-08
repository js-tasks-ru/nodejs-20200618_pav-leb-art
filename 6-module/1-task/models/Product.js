const mongoose = require('mongoose');
const connection = require('../libs/connection');
const { isInteger } = require('lodash');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subcategory: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
    },
    images: [String]

});

module.exports = connection.model('Product', productSchema);
