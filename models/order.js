
const path = require('path')
const fs = require('fs');
const rootDir = require('../utils/utils');
const { Schema, model } = require('mongoose');

const OrderSchema = new Schema({
    products: [
        {
        product : {type: Object, required: true},
        qty : {type: Number, required: true}
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = model('Order', OrderSchema)
