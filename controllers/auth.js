const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.getSignIn = (req, res, next)=>{
    res.render('auth/signin', {pageTitle: "Page | Sign In"})
}

exports.postSignIn = async (req, res, next)=>{
    const { email, password } = req.body;
    const user = await User.findOne({email: email})
    if(!user) return res.redirect('/sign-in')
    
    let isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword) return res.redirect('/sign-in')

    req.session.isLoggedIn = true
    req.session.user = user
    res.redirect('/')
}

exports.getSignUp = (req, res, next)=>{
    res.render('auth/signup', {pageTitle: "Page | Sign Up"})
}

exports.postSignUp = async (req, res, next)=>{
    try{
        const { name, email, password } = req.body;

        let user = await User.findOne({email: email})
        if(user) return res.redirect('/sign-up')

        hashedPassword = await bcrypt.hash(password, 12)

        user = new User({
            name, email, 
            password: hashedPassword, cart : { products: []}
        })
        console.log(user)
        await user.save()
        res.redirect('/sign-in')
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}

exports.postSignOut = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)console.log(err)
        res.redirect('/')
    })
}
