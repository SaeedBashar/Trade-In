const express = require('express')
const { getSignIn, postSignIn, postSignOut } = require('../controllers/auth')

const router = express.Router()

router.get('/sign-in', getSignIn)

router.post('/sign-in', postSignIn)

router.post('/sign-out', postSignOut)

module.exports = router