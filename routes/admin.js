const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { isAuthenticated } = require('../middleware/auth');
const { 
    getAddProduct, postAddProduct, 
    getProducts, getEditProduct,
    postEditProduct, deleteProduct 
} = require('../controllers/admin')

router.get('/add-product', isAuthenticated, getAddProduct)

router.get('/products', isAuthenticated, getProducts)

router.post('/add-product', isAuthenticated, postAddProduct)

router.get('/edit-product/:id', isAuthenticated, getEditProduct)

router.post('/edit-product', isAuthenticated, postEditProduct)

router.delete('/delete/:id', isAuthenticated, deleteProduct)

module.exports = router
