
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
    // let userId = req.user.id
    const product = new Product({
        title,
        description,
        price,
        category,
        imageUrl
    })
    product.save()
    .then(resp=>{
        console.log(resp)
    })
    .catch(err=>{
        console.log(err)
    })
    // const product = new Product(null, title, category, imageUrl, description, price, userId)
    // product.save()
    // res.redirect('/')
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
            product : product
        })
    }catch(err){
        console.log(err)
    }
    
    // Product.findById(productId, product=>{
    //     if(!product) return redirect('/')
    //     res.render('admin/edit-product', {
    //         pageTitle: 'Page | Edit Product',
    //         editing: editMode === 'true',
    //         product : product
    //     })
    // })
}

exports.postEditProduct = async (req, res, next)=>{
  
    try{
        const product = await Product.findById(req.body.productId)
        product.title = req.body.title
        product.description = req.body.description
        product.price = req.body.price
        product.category = req.body.category
        product.imageUrl = req.body.imageUrl

        product.save()
    }catch(err){
        console.log(err)
    }
    res.redirect('/')

    // const product = new Product(pid, title, category, imageUrl, description, price, req.user.id)
    // product.save()
}

exports.getProducts = async (req, res, next)=>{
    try{
        const products = await Product.find()
        console.log(products)
        // let userProducts = products.filter(p=>p.userId === req.user.id)
        res.render('admin/products', {
            products: products,
            pageTitle: 'Page | Admin Products'
        })
    }catch(err){
        console.log(err)
    }
    
    // Product.fetchAll(products=>{
    //     let userProducts = products.filter(p=>p.userId === req.user.id)
    //     res.render('admin/products', {
    //         products: userProducts,
    //         pageTitle: 'Page | Admin Products'
    //     })
    // })
}

exports.postDeleteProduct = async (req, res, next)=>{
    try{
        const pid = req.body.productId;
        const resp = await Product.findByIdAndRemove(pid)
    }catch(err){
        console.log(err)
    }
    // Product.deleteById(pid)
    res.redirect('/admin/products')
}