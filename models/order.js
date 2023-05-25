
const path = require('path')
const fs = require('fs');
const rootDir = require('../utils/utils');

const p = path.join(rootDir, 'data', 'order.json');

const getFileOrder = (cb)=>{
    fs.readFile(p, (err, data)=>{
        let orders = []
        if(!err){
            orders = [...JSON.parse(data)]
        }
        cb(orders)
    })
}

module.exports = class Order {
    constructor(id, userId, products, totalPrice){
        this.id = id;
        this.userId = userId;
        this.products = products;
        this.totalPrice = totalPrice;
    }
   
    saveOrder(cb){
        getFileOrder(orders=>{
            let updatedOrders = [...orders, this]
            fs.writeFile(p, JSON.stringify(updatedOrders), err=>{
                console.log(err)
                cb()
            })
        })
    }

    static getOrders(cb){
        getFileOrder(orders=>{
            cb(orders)
        })
    }
}