const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { validationResult } = require('express-validator')
exports.getSignIn = (req, res, next)=>{
    res.render('auth/signin', {
        pageTitle: "Page | Sign In",
        errorMsgs: req.flash('authError').map(err=>({msg: err}))
    })
}

exports.postSignIn = async (req, res, next)=>{

    const vResults = validationResult(req)
    console.log(vResults)
    if(vResults.errors.length > 0){
        return res.render('auth/signin', {
            pageTitle: "Page | Sign In",
            errorMsgs: vResults.errors
        })
    }

    const { email, password } = req.body;
    const user = await User.findOne({email: email})
    if(!user) {
        req.flash('authError', 'Invalid Email!!')
        return res.redirect('/sign-in')
    }
    
    let isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword) {
        req.flash('authError', 'Invalid Password!!')
        return res.redirect('/sign-in')
    }

    req.session.isLoggedIn = true
    req.session.user = user
    res.redirect('/')
}

exports.getSignUp = (req, res, next)=>{
    res.render('auth/signup', {
        pageTitle: "Page | Sign Up",
        errorMsgs: req.flash('signUpError')
    })
}

exports.postSignUp = async (req, res, next)=>{
    try{
        const { name, email, password } = req.body;

        let user = await User.findOne({email: email})
        if(user) {
            req.flash('signUpError', 'Email Exist Already!!')
            return res.redirect('/sign-up')
        }

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

exports.getProfile = (req, res, next)=>{
    res.render('profile', {
        pageTitle: "Page | User Profile"
    })
}