const express = require('express');

const router = express.Router();
const { getAddProduct, postAddProduct, getProducts } = require('../controllers/admin')

router.get('/add-product', getAddProduct)

router.get('/products', getProducts)

router.post('/add-product', postAddProduct)

router.post('/edit-product')

router.post('/delete-product')

module.exports = router
