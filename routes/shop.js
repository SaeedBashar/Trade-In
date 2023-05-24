const path = require('path');
const express = require('express');
const {
     getProducts, getIndex, 
     getCart, getCheckout, 
     getProduct, postCart } = require('../controllers/shop');


const router = express.Router()

router.get('/', getIndex)
router.get('/products', getProducts)
router.get('/products/:id', getProduct)
router.get('/cart', getCart)
router.post('/cart', postCart)
router.get('/checkout', getCheckout)
router.post('/add-to-cart')

module.exports = router
