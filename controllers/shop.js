
const Product = require('../models/product');
const Cart = require('../models/cart');

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
    console.log(prodId)
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
        res.render('shop/index.ejs', {
            products: products,
            pageTitle: 'Page | Shop'
        })
    })
}

exports.getCart = (req, res, next)=>{
    Cart.getCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts = [];
            for(prod of products){
                const cartProduct = cart.products.find(p=>p.id === prod.id)
                if(cartProduct){
                    cartProducts.push({product: prod, qty: cartProduct.qty})
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Page | Cart',
                products: cartProducts
            })
        })
    })
   
}

exports.postCart = (req, res, next)=>{
    const pid = req.body.productId;
    Product.findById(pid, ({price})=>{
        Cart.addProduct(pid, price)
    })
    res.redirect('/cart')
}

exports.postDeleteCartItem = (req, res, next)=>{
    const pid = req.body.productId;
    console.log(pid)
    Product.findById(pid, ({price})=>{
        Cart.deleteProduct(pid, price)
        res.redirect('/cart')
    })
}

exports.getCheckout = (req, res, next)=>{
    res.render('shop/checkout', {
        pageTitle: 'Page | Checkout'
    })
}