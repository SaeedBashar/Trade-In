
const Product = require('../models/product');


exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Page | Add Product',
        editing: false
    })
}

exports.postAddProduct = (req, res,next)=>{
    let title = req.body.title
    let description = req.body.description
    let price = req.body.price
    let category = req.body.category
    let imageUrl = req.body.imageUrl
    let userId = req.user.id

    const product = new Product(null, title, category, imageUrl, description, price, userId)
    product.save()
    res.redirect('/')
}

exports.getEditProduct = (req, res, next)=>{
    let editMode = req.query.edit
    let productId = req.params.id
    Product.findById(productId, product=>{
        if(!product) return redirect('/')
        res.render('admin/edit-product', {
            pageTitle: 'Page | Edit Product',
            editing: editMode === 'true',
            product : product
        })
    })
}

exports.postEditProduct = (req, res, next)=>{
    let pid = req.body.productId;
    let title = req.body.title
    let description = req.body.description
    let price = req.body.price
    let category = req.body.category
    let imageUrl = req.body.imageUrl
    const product = new Product(pid, title, category, imageUrl, description, price, req.user.id)
    product.save()
    res.redirect('/')
}

exports.getProducts = (req, res, next)=>{
    Product.fetchAll(products=>{
        let userProducts = products.filter(p=>p.userId === req.user.id)
        res.render('admin/products', {
            products: userProducts,
            pageTitle: 'Page | Admin Products'
        })
    })
}

exports.postDeleteProduct = (req, res, next)=>{
    const pid = req.body.productId;
    Product.deleteById(pid)
    res.redirect('/')
}