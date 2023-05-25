const path = require('path');
const express = require('express');
const {
     getProducts, getIndex, 
     getCart, getCheckout, 
     getProduct, postCart,
     postDeleteCartItem, 
     getOrders, postOrders} = require('../controllers/shop');


const router = express.Router()

router.get('/', getIndex)
router.get('/products', getProducts)
router.get('/products/:id', getProduct)
router.get('/cart', getCart)
router.post('/cart', postCart)
router.post('/delete-cart-item', postDeleteCartItem)
router.get('/order', getOrders)
router.post('/order', postOrders)
router.get('/checkout', getCheckout)

module.exports = router
