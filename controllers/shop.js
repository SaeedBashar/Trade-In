
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getProducts = async (req, res, next)=>{
    try{
        const products = await Product.find()
        // let userProducts = products.filter(p=>p.userId === req.user.id)
        res.render('shop/index', {
            products: products,
            pageTitle: 'Page | Shop'
        })
    }catch(err){
        console.log(err)
    }
    // Product.fetchAll(products=>{
    //     let userProducts = products.filter(p=>p.userId === req.user.id)
    //     res.render('shop/product-list', {
    //         products: userProducts,
    //         pageTitle: 'Page | Shop'
    //     })
    // })
}

exports.getProduct = async(req, res, next)=>{
    const prodId = req.params.id;
    const product = await Product.findById(prodId)
    res.render('shop/product-detail', {
        product: product,
        pageTitle: 'Page | Product Detail'
    })
    // Product.findById(prodId, product=>{
    //     console.log(product)
    //     res.render('shop/product-detail', {
    //         product: product,
    //         pageTitle: 'Page | Product Detail'
    //     })
    // })
}

exports.getIndex = async (req, res, next)=>{
    try{
        const products = await Product.find()
        // let userProducts = products.filter(p=>p.userId === req.user.id)
        res.render('shop/index', {
            products: products,
            pageTitle: 'Page | Shop'
        })
    }catch(err){
        console.log(err)
    }
    // Product.fetchAll(products=>{
    //     let userProducts = products.filter(p=>p.userId === req.user.id)
    //     res.render('shop/index.ejs', {
    //         products: userProducts,
    //         pageTitle: 'Page | Shop'
    //     })
    // })
}

exports.getCart = async(req, res, next)=>{
    const user = await req.user.populate("cart.products.productId")
    console.log(user.cart.products[0])
    res.render('shop/cart', {
        pageTitle: 'Page | Cart',
        products: user.cart.products,
        totalPrice : 3000
    })
    // Cart.getCart(cart=>{
    //     Product.fetchAll(products=>{
    //         const cartProducts = [];
    //         for(prod of products){
    //             const cartProduct = cart.products.find(p=>p.id === prod.id)
    //             if(cartProduct){
    //                 cartProducts.push({product: prod, qty: cartProduct.qty})
    //             }
    //         }
    //         res.render('shop/cart', {
    //             pageTitle: 'Page | Cart',
    //             products: cartProducts,
    //             totalPrice : cart.totalPrice.toFixed(2)
    //         })
    //     })
    // })
   
}

exports.postCart = async (req, res, next)=>{
    try{
        const pid = req.body.productId;
        const product = await Product.findById(pid)
        await req.user.addToCart(product)
    }catch(err){
        console.log(err)
    }
    res.redirect('/')
}

exports.postDeleteCartItem = async (req, res, next)=>{
    try{
        const pid = req.body.productId;
       
        const resp = await req.user.deleteItemFromCart(pid)
        console.log('[DELETION]', resp)
    }catch(err){
        console.log(err)
    }
    res.redirect('/cart')
}

exports.getOrders = (req, res, next)=>{
    Order.getOrders(orders=>{
        let userOrders = orders.filter(o=>o.userId === req.user.id)
        Product.fetchAll(products=>{
            let orderProducts;
            for(let order of userOrders){
                orderProducts = [...order.products];
                order.products = orderProducts.map(p=>{
                    for(prod of products){
                        if(prod.id == p.id){
                            return {product : prod, qty: p.qty}
                        }
                    }
                })
            }
            res.render('shop/orders', {
                pageTitle: 'Page | Orders',
                orders: userOrders
            })
        })
    })
}

exports.postOrders = (req, res, next)=>{
    Cart.getCart(cart=>{
        let id = Date.now() + parseInt(Math.random() * 100)
        let order = new Order(id, cart.userId, cart.products, cart.totalPrice)
        order.saveOrder(()=>{
            res.redirect('/order')
        })
        Cart.deleteCart()
    })
}

exports.getCheckout = (req, res, next)=>{
    res.render('shop/checkout', {
        pageTitle: 'Page | Checkout'
    })
}