
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getProducts = (req, res, next)=>{
    Product.fetchAll(products=>{
        let userProducts = products.filter(p=>p.userId === req.user.id)
        res.render('shop/product-list', {
            products: userProducts,
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
        let userProducts = products.filter(p=>p.userId === req.user.id)
        res.render('shop/index.ejs', {
            products: userProducts,
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
                products: cartProducts,
                totalPrice : cart.totalPrice.toFixed(2)
            })
        })
    })
   
}

exports.postCart = (req, res, next)=>{
    const pid = req.body.productId;
    Product.findById(pid, ({price})=>{
        Cart.addProduct(pid, price, req.user.id)
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

exports.getOrders = (req, res, next)=>{
    res.render('shop/orders', {
        pageTitle: 'Page | Orders'
    })
}

exports.postOrders = (req, res, next)=>{
    Cart.getCart(cart=>{
        let id = Date.now() + parseInt(Math.random() * 100)
        let order = new Order(id, cart.userId, cart.products, cart.totalPrice)
        order.saveOrder(()=>{
            res.render('shop/orders', {
                pageTitle: 'Page | Orders'
            })
        })
        Cart.deleteCart()
    })
}

exports.getCheckout = (req, res, next)=>{
    res.render('shop/checkout', {
        pageTitle: 'Page | Checkout'
    })
}