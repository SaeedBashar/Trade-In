
const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next)=>{
    try{
        const products = await Product.find()
        // let userProducts = products.filter(p=>p.userId === req.user.id)
        res.render('shop/index', {
            products: products,
            pageTitle: 'Page | Shop',
            
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
        pageTitle: 'Page | Product Detail',
    })
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
}

exports.getCart = async(req, res, next)=>{
    const user = await req.user.populate("cart.products.productId")
    res.render('shop/cart', {
        pageTitle: 'Page | Cart',
        products: user.cart.products,
        
    })
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
    }catch(err){
        console.log(err)
    }
    res.redirect('/cart')
}

exports.getOrders = async (req, res, next)=>{
    const orders = await Order.find({"user": req.user._id.toString()})
    const updatedOrders = orders.map(o=>{
        let totalPrice = o.products.reduce((t, prod)=>{
            return t + prod.product.price * prod.qty
        }, 0)
        return {...o._doc, totalPrice}
    })
    console.log(updatedOrders)
    res.render('shop/orders', {
        pageTitle: 'Page | Orders',
        orders: updatedOrders,
        totalPrice: 1000,
        
    })
    // Order.getOrders(orders=>{
    //     let userOrders = orders.filter(o=>o.userId === req.user.id)
    //     Product.fetchAll(products=>{
    //         let orderProducts;
    //         for(let order of userOrders){
    //             orderProducts = [...order.products];
    //             order.products = orderProducts.map(p=>{
    //                 for(prod of products){
    //                     if(prod.id == p.id){
    //                         return {product : prod, qty: p.qty}
    //                     }
    //                 }
    //             })
    //         }
    //         res.render('shop/orders', {
    //             pageTitle: 'Page | Orders',
    //             orders: userOrders
    //         })
    //     })
    // })
}

exports.postOrders = async(req, res, next)=>{
    try{
        const user = await req.user.populate("cart.products.productId")
        console.log(user.cart.products)
        const order = await new Order({
            user: user,
            products: [...user.cart.products.map(p=>({product: {...p.productId}, qty: p.qty}))]
        })
        await order.save()
        req.user.clearCart()
    }catch(err){
        console.log(err)
    }
    res.redirect('/order')

    // Cart.getCart(cart=>{
    //     let id = Date.now() + parseInt(Math.random() * 100)
    //     let order = new Order(id, cart.userId, cart.products, cart.totalPrice)
    //     order.saveOrder(()=>{
    //         res.redirect('/order')
    //     })
    //     Cart.deleteCart()
    // })
}

exports.getCheckout = (req, res, next)=>{
    res.render('shop/checkout', {
        pageTitle: 'Page | Checkout',
        
    })
}