
const Product = require('../models/product');


exports.getProducts = (req, res, next)=>{
    Product.fetchAll(products=>{
        res.render('shop/product-list', {
            products: products,
            pageTitle: 'Page | Shop'
        })
    })
}

exports.getProduct = (req, res, next)=>{
    const prodId = req.params.id;

    Product.findById(prodId, product=>{
        console.log(product)
        res.render('shop/product-detail', {
            product: product,
            pageTitle: 'Page | Product Detail'
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

exports.postCart = (req, res, next)=>{
    const pid = req.body.productId;
    console.log(pid)
    res.render('shop/cart', {
        pageTitle: 'Page | Cart'
    })
}

exports.getCheckout = (req, res, next)=>{
    res.render('shop/checkout', {
        pageTitle: 'Page | Checkout'
    })
}