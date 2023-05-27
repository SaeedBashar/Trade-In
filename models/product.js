const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const rootDir = require('../utils/utils');
 
const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category : {
        type: String,
        required: true
    },
    imageUrl: {
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
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Product', ProductSchema);

