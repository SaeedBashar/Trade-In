const express = require('express')
const { getSignIn, postSignIn } = require('../controllers/auth')

const router = express.Router()

router.get('/sign-in', getSignIn)
router.post('/sign-in', postSignIn)

module.exports = router