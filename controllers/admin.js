
const Product = require('../models/product');
const { validationResult } = require('express-validator')
const path = require('path')
const fileUtil = require('../utils/file')
const rootDir = require('../utils/utils')

exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Page | Add Product',
        editing: false,
        errorMsgs: req.flash('error').map(e=>({msg: e}))
    })
}

exports.postAddProduct = async (req, res,next)=>{
    try{

        let title = req.body.title
        let description = req.body.description
        let price = req.body.price
        let category = req.body.category
        let image = req.file
        let userId = req.user

        if(!image) {
            console.log('error here')
            throw new Error("Invalid Image value")
        }

        const product = new Product({
            title,
            description,
            price,
            category,
            imageUrl: path.join('/', image.filename),
            userId
        })
        await product.save()
        res.redirect('/admin/products')
    }catch(err){
        req.flash('error', 'An Error Occured While adding Product!!');
        return res.redirect('/admin/add-product')
    }
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
            errorMsgs: req.flash('error').map(e=>({msg: e}))
        })
    }catch(err){
        console.log(err)
    }
}

exports.postEditProduct = async (req, res, next)=>{
  
    try{
        const product = await Product.findById(req.body.productId)
        if(req.user._id.toString() === product.userId.toString()){
            if(image){
                fileUtil.deleteFile(product.imageUrl)
            }

            product.title = req.body.title
            product.description = req.body.description
            product.price = req.body.price
            product.category = req.body.category
            product.imageUrl = path.join('/', req.file.filename)
            
            
            product.save()
        }
            
        res.redirect('/admin/products')
    }catch(err){
        req.flash('error', 'An Error Occured While Editing Product!!');
        return res.redirect(`/admin/edit-product/${req.body.productId}?edit=true`)
    }
}

exports.getProducts = async (req, res, next)=>{
    try{
        const products = await Product.find({userId: req.user._id}).populate("userId")
        res.render('admin/products', {
            products: products,
            pageTitle: 'Page | Admin Products',
            
        })
    }catch(err){
        console.log(err)
    }
}

exports.deleteProduct = async (req, res, next)=>{
    try{
        const pid = req.params.id;
        const product = await Product.findById(pid)
        if(product){
            fileUtil.deleteFile(path.join(rootDir, 'images', product.imageUrl))
        }
        await Product.deleteOne({_id: pid, userId: req.user._id})
        return res.status(200).json({msg: 'Product Deleted Successfully'})
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: 'Error Deleting Product'})
    }
}