const express = require('express')
const { check, body } = require('express-validator')
const { 
    getSignIn, postSignIn,
    getSignUp, postSignUp, 
    postSignOut, getProfile } = require('../controllers/auth')
    const { isAuthenticated } = require('../middleware/auth');

const router = express.Router()

router.get('/sign-in', getSignIn)

router.post('/sign-in', 
    [
        check('email')
        .isEmail().withMessage('Invalid Email Format!!'),
        body('password', 'Password Should be a Minium of 3')
        .isLength({min: 3})
    ],
    postSignIn)

router.get('/sign-up', getSignUp)

router.post('/sign-up', postSignUp)

router.post('/sign-out', postSignOut)

router.get('/user-profile', isAuthenticated, getProfile)

module.exports = router