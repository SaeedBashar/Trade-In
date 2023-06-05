const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');
const { verifyPayment } = require('../utils/file');
const User = require('../models/user')

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
    res.render('shop/orders', {
        pageTitle: 'Page | Orders',
        orders: updatedOrders,
        errorMsgs: req.flash('error').map(e=>({msg: e}))
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
        const txRef = req.query.reference;
    
        if(req.user.txReference === txRef){
            const user = await req.user.populate("cart.products.productId")
            const order = await new Order({
                user: user,
                products: [...user.cart.products.map(p=>({product: {...p.productId}, qty: p.qty}))]
            })
            await order.save()
            req.user.clearCart()
            return res.redirect('/orders')
        }
    }catch(err){
        console.log(err)
    }
    res.redirect('/')

    // Cart.getCart(cart=>{
    //     let id = Date.now() + parseInt(Math.random() * 100)
    //     let order = new Order(id, cart.userId, cart.products, cart.totalPrice)
    //     order.saveOrder(()=>{
    //         res.redirect('/order')
    //     })
    //     Cart.deleteCart()
    // })
}

exports.getInvoice = async (req, res, next)=>{
    try{
        const orderId = req.params.id;

        const order = await Order.findById(orderId)
        if(!order) throw new Error('No Invoice')
        if(req.user._id.toString() !== order.user.toString()){
            throw new Error('Access Error')
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const pathName = path.join('data', 'invoices', invoiceName);
        
        const pdfDoc = new pdfDocument()
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
        pdfDoc.pipe(fs.createWriteStream(pathName));
        pdfDoc.pipe(res)
 
        pdfDoc.fontSize(30).text('Invoice', {underline: true})
        pdfDoc.fontSize(16).text('=======================================')
        let totalPrice = 0;
        order.products.forEach(prod=>{
            totalPrice += (prod.product.price * prod.qty)
            pdfDoc.text('----------------------------------')
            pdfDoc.text('Product Title - ' + prod.product.title)
            pdfDoc.text('Product Quantity - ' + prod.qty)
            pdfDoc.text('Product price - $ ' + (prod.product.price * prod.qty))
            pdfDoc.text('----------------------------------')
        })
        pdfDoc.text('Total Price - $ ' + totalPrice)
        pdfDoc.text('----------------------------------')
        pdfDoc.end()
        // fs.readFile(pathName, (err, data)=>{
        //     if(err) throw err
        //     res.setHeader('Content-Type', 'application/pdf')
        //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
        //     res.send(data)
        // })
        // const file = fs.createReadStream(pathName)
        // res.setHeader('Content-Type', 'application/pdf')
        // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
        // file.pipe(res)
    }catch(err){
        console.log(err)
        req.flash('error', 'Error Accessing Invoice')
        res.redirect('/order')
    }
    
}

// exports.getCheckout = async(req, res, next)=>{
//     const user = await req.user.populate("cart.products.productId")
//     let totalPrice = 0
//     totalPrice = user.cart.products.reduce((t, p)=>(t + (p.productId.price * p.qty)))
//     res.render('shop/checkout', {
//         pageTitle: 'Page | Checkout',
//         products: user.cart.products,
//         totalPrice :totalPrice
//     })
// }

exports.getCheckout = async(req,res, next)=>{
    const user = await req.user.populate("cart.products.productId")
    
    let totalPrice = 0
    user.cart.products.forEach(p=>{
        totalPrice += (p.productId.price * p.qty)
    })

    const https = require('https')

    const params = JSON.stringify({
    "email": req.user.email,
    "amount": totalPrice * 100,
    "callback_url": 'http://localhost:4000/order',
    })

    const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
        Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
        'Content-Type': 'application/json'
    }
    }

    const reqps = https.request(options, resps => {
    let data = ''

    resps.on('data', (chunk) => {
        data += chunk
    });

    resps.on('end', async () => {
        const resData = JSON.parse(data)
        if(resData.status){
            const user = await User.findById(req.user._id);
            user.txReference = resData.data.reference;
            await user.save();
            return res.redirect(resData.data.authorization_url)
        }
        return res.redirect('/orders')
        // res.send(data)
    })
    }).on('error', error => {
        console.error(error)
        return res.redirect('/orders')
    })

    reqps.write(params)
    reqps.end()
}

