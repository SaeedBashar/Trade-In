const express = require('express')
const { 
    getSignIn, postSignIn,
    getSignUp, postSignUp, 
    postSignOut } = require('../controllers/auth')

const router = express.Router()

router.get('/sign-in', getSignIn)

router.post('/sign-in', postSignIn)

router.get('/sign-up', getSignUp)

router.post('/sign-up', postSignUp)

router.post('/sign-out', postSignOut)

module.exports = router