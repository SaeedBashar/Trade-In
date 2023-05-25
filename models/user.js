const path = require('path');
const fs = require('fs');
const { Schema, model } = require('mongoose');
const rootDir = require('../utils/utils')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                }, 
                qty: {
                    type: Number, 
                    required: true
                }
            }
        ]
    }
})

UserSchema.methods.addToCart = function(product){
    let pIndex = this.cart.products.findIndex(p=>p.productId.toString() === product._id.toString())
    let updatedProduct;
    let updatedProducts = [...this.cart.products]
    console.log('one', updatedProducts)
    console.log('two', pIndex)
    if(pIndex !== -1 ){
        updatedProduct = {...updatedProducts[pIndex]._doc};
        updatedProduct.qty += 1;
        updatedProducts[pIndex] = updatedProduct;
    }
    else{
        updatedProduct = {productId: product._id, qty: 1};
        updatedProducts = [...updatedProducts, updatedProduct];
    }
    this.cart.products = updatedProducts
    return this.save()
}

UserSchema.methods.deleteItemFromCart = function(productId){
    let updatedProducts = this.cart.products.filter(p=>p.productId.toString() !== productId.toString())
    this.cart.products = updatedProducts;
    return this.save()
}

module.exports = model('User', UserSchema)
// const p = path.join(rootDir, 'data', 'user.json');

// const getFileUser = (cb)=>{
//     fs.readFile(p, (err, data)=>{
//         let users = []
//         if(!err){
//             users = [...JSON.parse(data)]
//         }
//         cb(users)
//     })
// }

// module.exports = class User {
//     constructor(id, name, email){
//         this.id = id;
//         this.name = name;
//         this.email = email;
//     }

//     save(){
//         getFileUser(users=>{
//             this.id = parseInt(Math.random() * 1000)
//             let updatedUsers = [...users, this]
//             fs.writeFile(p, JSON.stringify(updatedUsers), err=>{
//                 console.log(err)
//             })
//         })
//     }

//     static fetchUsers(cb){
//         getFileUser(cb)
//     }

//     static findUserById(id, cb){
//         getFileUser(users=>{
//             let user = users.find(u=>u.id === id)
//             cb(user)
//         })
//     }
// }