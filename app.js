const express = require('express')
const path = require('path')
const rootDir = require('./utils/utils')
const mongoose = require('mongoose')
const app = express()

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorRoute = require('./controllers/error');
const User = require('./models/user')

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(rootDir, 'public')))

app.use(async(req, res, next)=>{
    const users = await User.find()
    let user;
    if(users.length == 0 ){
        user = await new User({
            name: "John Smith",
            email: "smith@gmail.com",
            cart: {
                products: []
            }
        })
        user.save()
    }else{
        user = users[0]
    }
    req.user = user
    next()

})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorRoute)

mongoose.connect('mongodb://127.0.0.1:27017/tradeIn')
.then(async (response)=>{
    const users = await User.find()
    let user;
    if(users.length == 0 ){
        user = await new User({
            name: "John Smith",
            email: "smith@gmail.com",
            cart: {
                products: []
            }
        })
        user.save()
    }
    console.log("[CONNECTED] Connection Setup Successfully.")
    app.listen(4000)
})
.catch(err=>{
    console.log(err)
})