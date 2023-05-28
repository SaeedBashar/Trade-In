
const Product = require('../models/product');
const { validationResult } = require('express-validator')


exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Page | Add Product',
        editing: false
    })
}

exports.postAddProduct = async (req, res,next)=>{
    try{

        let title = req.body.title
        let description = req.body.description
        let price = req.body.price
        let category = req.body.category
        let imageUrl = req.body.imageUrl
        let userId = req.user
        const product = new Product({
            title,
            description,
            price,
            category,
            imageUrl,
            userId
        })
        await product.save()
    }catch(err){
        console.log(err)

    }
    res.redirect('/admin/products')
}

exports.getEditProduct = async(req, res, next)=>{
    
    try{
        let editMode = req.query.edit
        // let productId = req.params.id

        const product = await Product.findById(req.params.id)
        if(!product) return redirect('/')
        res.render('admin/edit-product', {
            pageTitle: 'Page | Edit Product',
            editing: editMode === 'true',
            product : product,
        })
    }catch(err){
        console.log(err)
    }
}

exports.postEditProduct = async (req, res, next)=>{
  
    try{
        const product = await Product.findById(req.body.productId)
        if(req.user._id.toString() === product.userId.toString()){
            product.title = req.body.title
            product.description = req.body.description
            product.price = req.body.price
            product.category = req.body.category
            product.imageUrl = req.body.imageUrl
    
            product.save()
        }
            
    }catch(err){
        console.log(err)
    }
    res.redirect('/')
}

exports.getProducts = async (req, res, next)=>{
    try{
        const products = await Product.find({userId: req.user._id}).populate("userId")
        console.log(products)
        // let userProducts = products.filter(p=>p.userId === req.user.id)
        res.render('admin/products', {
            products: products,
            pageTitle: 'Page | Admin Products',
            
        })
    }catch(err){
        console.log(err)
    }
}

exports.postDeleteProduct = async (req, res, next)=>{
    try{
        const pid = req.body.productId;
        await Product.deleteOne({_id: pid, userId: req.user._id})
    }catch(err){
        console.log(err)
    }
    res.redirect('/admin/products')
}