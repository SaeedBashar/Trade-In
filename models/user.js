const path = require('path');
const fs = require('fs');
const rootDir = require('../utils/utils')

const p = path.join(rootDir, 'data', 'user.json');

const getFileUser = (cb)=>{
    fs.readFile(p, (err, data)=>{
        let users = []
        if(!err){
            users = [...JSON.parse(data)]
        }
        cb(users)
    })
}

module.exports = class User {
    constructor(id, name, email){
        this.id = id;
        this.name = name;
        this.email = email;
    }

    save(){
        getFileUser(users=>{
            this.id = parseInt(Math.random() * 1000)
            let updatedUsers = [...users, this]
            fs.writeFile(p, JSON.stringify(updatedUsers), err=>{
                console.log(err)
            })
        })
    }

    static fetchUsers(cb){
        getFileUser(cb)
    }

    static findUserById(id, cb){
        getFileUser(users=>{
            let user = users.find(u=>u.id === id)
            cb(user)
        })
    }
}