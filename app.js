const express = require('express')
const path = require('path')
const rootDir = require('./utils/utils')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoStore = require('connect-mongodb-session')(session)
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

require('dotenv').config()
const app = express()

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorRoute = require('./controllers/error');
const User = require('./models/user')
const crypto = require('crypto');

app.set('view engine', 'ejs');
app.set('views', 'views')

const store = new mongoStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>cb(null, 'images'),
    filename: (req, file, cb)=>{
        cb(null, crypto.randomBytes(5).toString('hex') + '-' +  file.originalname)
    }
})

const fileFilter = (req, file, cb)=>{
    if(
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/png'
    ){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

app.use(express.urlencoded({extended: false}))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(express.static(path.join(rootDir, 'public')))
app.use(express.static(path.join(rootDir, 'images')))

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
    res.locals.user = req.user ? {name: req.user.name, email: req.user.email}: null
    next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorRoute)

mongoose.connect(process.env.MONGO_URI)
.then(async (response)=>{
    console.log("[CONNECTED] Connection Setup Successfully.")
    app.listen(4000)
})
.catch(err=>{
    console.log(err)
})