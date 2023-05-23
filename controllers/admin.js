
const Product = require('../models/product');


exports.getAddProduct = (req, res, next)=>{
    res.render('admin/add-product', {
        pageTitle: 'Page | Add Product',
    })
}

exports.postAddProduct = (req, res,next)=>{
    let title = req.body.title
    let description = req.body.description
    let price = req.body.price
    let category = req.body.category
    let imageUrl = req.body.imageUrl

    const product = new Product(title, category, imageUrl, description, price)
    product.save()
    res.redirect('/')
}

exports.getProducts = (req, res, next)=>{
    Product.fetchAll(products=>{
        res.render('admin/products', {
            products: products,
            pageTitle: 'Page | Admin Products'
        })
    })
}