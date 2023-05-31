const fs = require('fs');
const https = require('https')
require('dotenv').config()

exports.deleteFile = (filePath)=>{
    fs.unlink(filePath, (err)=>{
        if(err){
            throw err
        }
    })
}
