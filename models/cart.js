
const path = require('path')
const fs = require('fs');
const rootDir = require('../utils/utils');

const p = path.join(rootDir, 'data', 'cart.json');

const getFileCart = (cb)=>{
    fs.readFile(p, (err, data)=>{
        let cart = {products: [], totalPrice : 0}
        if(!err){
            cart = {...JSON.parse(data)}
        }
        cb(cart)
    })
}

module.exports = class Cart {
   
    static addProduct(id, productPrice){
        getFileCart(cart=>{
            let pIndex = cart.products.findIndex(p=>p.id === id)
            let updatedProduct;
            if(pIndex !== -1 ){
                updatedProduct = {...cart.products[pIndex]};
                updatedProduct.qty += 1;
                cart.products[pIndex] = updatedProduct;
            }else{
                updatedProduct = {id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err=>{
                console.log(err)
            })
        })
    }

    static deleteProduct(id, price){
        getFileCart(cart=>{
            const product = cart.products.find(p=>p.id === id);
            const qty = product.qty;
            const updatedCart = {...cart}
            updatedCart.products = cart.products.filter(p=>p.id !== id);
            updatedCart.totalPrice -= price * product.qty;
            fs.writeFile(p, JSON.stringify(updatedCart), err=>{
                console.log(err)
            })
        })
    }

    static getCart(cb){
        getFileCart(cart=>{
            cb(cart)
        })
    }
}