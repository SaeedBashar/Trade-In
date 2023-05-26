

exports.getSignIn = (req, res, next)=>{
    res.render('auth/signin', {pageTitle: "Page | Sign In"})
}

exports.postSignIn = (req, res, next)=>{
    res.setHeader('Set-Cookie', 'isLoggedIn=true')
    res.redirect('/')
}