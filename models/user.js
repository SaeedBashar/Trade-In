const path = require('path');
const fs = require('fs');
const { Schema, model } = require('mongoose');
const rootDir = require('../utils/utils')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                }, 
                qty: {
                    type: Number, 
                    required: true
                }
            }
        ]
    }
})

UserSchema.methods.addToCart = function(product){
    let pIndex = this.cart.products.findIndex(p=>p.productId.toString() === product._id.toString())
    let updatedProduct;
    let updatedProducts = [...this.cart.products]
    if(pIndex !== -1 ){
        updatedProduct = {...updatedProducts[pIndex]._doc};
        updatedProduct.qty += 1;
        updatedProducts[pIndex] = updatedProduct;
    }
    else{
        updatedProduct = {productId: product._id, qty: 1};
        updatedProducts = [...updatedProducts, updatedProduct];
    }
    this.cart.products = updatedProducts
    return this.save()
}

UserSchema.methods.deleteItemFromCart = function(productId){
    let updatedProducts = this.cart.products.filter(p=>p.productId.toString() !== productId.toString())
    this.cart.products = updatedProducts;
    return this.save()
}

UserSchema.methods.clearCart = function(){
    this.cart = { products: []}
    return this.save()
}

module.exports = model('User', UserSchema)
