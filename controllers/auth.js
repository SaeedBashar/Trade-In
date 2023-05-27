const User = require('../models/user')

exports.getSignIn = (req, res, next)=>{
    res.render('auth/signin', {pageTitle: "Page | Sign In"})
}

exports.postSignIn = async (req, res, next)=>{
    const users = await User.find()
    req.session.isLoggedIn = true
    req.session.user = users[0]
    res.redirect('/')
}

exports.postSignOut = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)console.log(err)
        res.redirect('/')
    })
}