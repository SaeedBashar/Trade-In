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
    constructor(id, title, category, imageUrl, description, price, userId){
        this.id = id;
        this.title = title;
        this.category = category;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.userId = userId;
    }

    save(){
        getFileProducts(products=>{
            if(this.id){
                console.log(this)
                const pIndex = products.findIndex(p=>p.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[pIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err=>{
                    console.log(err)
                })
            }else{
                this.id = (products.length * 10 + Date.now()).toString()
                products.push(this)
                fs.writeFile(p, JSON.stringify(products), err=>{
                    console.log(err)
                })
            }
        })
    }
    
    static deleteById(pid){
        getFileProducts(products=>{
            const updatedProducts = products.filter(p=>p.id !== pid);
            fs.writeFile(p, JSON.stringify(updatedProducts), err=>{
                console.log(err)
            })
        })
    }

    static fetchAll(cb){
        getFileProducts(cb)
    }

    static findById(pid, cb){
        getFileProducts(products=>{
            const product = products.find(p=>p.id === pid)
            cb(product)
        })
    }
}