const express = require('express')
const path = require('path')
const rootDir = require('./utils/utils')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoStore = require('connect-mongodb-session')(session)
const csrf = require('csurf');
const flash = require('connect-flash');

require('dotenv').config()
const app = express()

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorRoute = require('./controllers/error');
const User = require('./models/user')

app.set('view engine', 'ejs');
app.set('views', 'views')

const store = new mongoStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(rootDir, 'public')))
app.use(session({
        secret: process.env.SESSION_SECRET, 
        resave: false, 
        saveUninitialized: false,
        store: store
    })
)
app.use(csrf())
app.use(flash())

app.use(async(req, res, next)=>{
    if(req.session.user){
        const user = await User.findById(req.session.user._id)
        req.user = user
    }
    next()
})

app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorRoute)

mongoose.connect(process.env.MONGO_URI)
.then(async (response)=>{

    // const users = await User.find()
    // await User.findByIdAndRemove(users[0]._id)
    // let user;
    // if(users.length == 0 ){
    //     user = await new User({
    //         name: "John Smith",
    //         email: "smith@gmail.com",
    //         cart: {
    //             products: []
    //         }
    //     })
    //     user.save()
    // }
    console.log("[CONNECTED] Connection Setup Successfully.")
    app.listen(4000)
})
.catch(err=>{
    console.log(err)
})