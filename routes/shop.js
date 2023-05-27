const path = require('path');
const express = require('express');
const {
     getProducts, getIndex, 
     getCart, getCheckout, 
     getProduct, postCart,
     postDeleteCartItem, 
     getOrders, postOrders} = require('../controllers/shop');
const { isAuthenticated } = require('../middleware/auth');


const router = express.Router()

router.get('/', getIndex)
router.get('/products', getProducts)
router.get('/products/:id', getProduct)
router.get('/cart', isAuthenticated, getCart)
router.post('/cart', isAuthenticated, postCart)
router.post('/delete-cart-item', isAuthenticated, postDeleteCartItem)
router.get('/order', isAuthenticated, getOrders)
router.post('/order', isAuthenticated, postOrders)
router.get('/checkout', isAuthenticated, getCheckout)

module.exports = router