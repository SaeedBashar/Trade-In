const express = require('express')
const path = require('path')
const rootDir = require('./utils/utils')
const mongoose = require('mongoose')
const app = express()

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoute = require('./controllers/error');
const User = require('./models/user')

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(rootDir, 'public')))

app.use((req, res, next)=>{
    User.fetchUsers(users=>{
        let user;
        if(users.length == 0 ){
            user = new User(null, "John Smith", "smith@gmail.com")
            user.save()
        }else{
            user = new User(users[0].id, users[0].name, users[0].email)
        }
        req.user = user
        next()
    })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorRoute)

app.listen(4000)