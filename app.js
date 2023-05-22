const express = require('express')

const app = express()

app.use((req, res, next)=>{
    res.send("<h3>Welcome To The World Of Trading</h3>")
})

app.listen(4000)