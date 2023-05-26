
const router = require('express').Router()
router.get((req, res, next)=>{
    res.render('404', {
        page: 'Page | 404',
        isAuthenticated : true
    })
})

module.exports = router