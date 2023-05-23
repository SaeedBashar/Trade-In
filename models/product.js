const path = require('path');
const fs = require('fs');
const rootDir = require('../utils/utils')
 
const p = path.join(rootDir, 'data', 'products.json');

const getFileProducts = (cb)=>{
    fs.readFile(p, (err, data)=>{
        let products = []
        if(!err){
            products = [...JSON.parse(data)]
        }
        cb(products)
    })
}

module.exports = class Product{
    constructor(title, category, imageUrl, description, price){
        this.title = title;
        this.category = category;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price
    }

    save(){
        getFileProducts(products=>{
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), err=>{
                console.log(err)
            })
        })
    }

    static fetchAll(cb){
        getFileProducts(cb)
    }
}