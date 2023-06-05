const path = require('path');
const express = require('express');
const {
     getProducts, getIndex, 
     getCart, getCheckout, 
     getProduct, postCart,
     postDeleteCartItem, 
     getOrders, postOrders, getInvoice} = require('../controllers/shop');
const { isAuthenticated } = require('../middleware/auth');


const router = express.Router()

router.get('/', getIndex)
router.get('/products', getProducts)
router.get('/products/:id', getProduct)
router.get('/cart', isAuthenticated, getCart)
router.post('/cart', isAuthenticated, postCart)
router.post('/delete-cart-item', isAuthenticated, postDeleteCartItem)
router.get('/orders', isAuthenticated, getOrders)
router.get('/order', isAuthenticated, postOrders)
router.get('/order/:id', isAuthenticated, getInvoice)
router.get('/checkout', isAuthenticated, getCheckout)
// router.get('/paystack', isAuthenticated, makePayment)
module.exports = router