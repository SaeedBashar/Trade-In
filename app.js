const express = require('express')
const path = require('path')
const rootDir = require('./utils/utils')
const app = express()

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoute = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(rootDir, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorRoute)

app.listen(4000)