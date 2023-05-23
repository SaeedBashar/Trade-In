
const Product = require('../models/product');


exports.getProducts = (req, res, next)=>{
    Product.fetchAll(products=>{
        res.render('shop/item-list', {
            products: products,
            pageTitle: 'Page | Shop'
        })
    })
}

exports.getIndex = (req, res, next)=>{
    Product.fetchAll(products=>{
        res.render('shop/index', {
            products: products,
            pageTitle: 'Page | Shop'
        })
    })
}

exports.getCart = (req, res, next)=>{
    res.render('shop/cart', {
        pageTitle: 'Page | Cart'
    })
}

exports.getCheckout = (req, res, next)=>{
    res.render('shop/checkout', {
        pageTitle: 'Page | Checkout'
    })
}