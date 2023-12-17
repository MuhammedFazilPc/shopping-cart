const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt')

module.exports = {
    userLogin: (userData) => {

        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            // console.log(user)
            // let status=false;
            let response = {}
            if (user) {
                const status = await bcrypt.compare(userData.Password, user.Password)
                if (status) {
                    console.log('login success: ' + status)
                    response.user = user
                    response.status = true
                    resolve(response)
                }

                else {
                    console.log('wrong password: ' + status)
                    resolve({ status: false })
                }


            } else {
                console.log('user doesnt exist: ')
                resolve({ status: false })
            }

        })
    },
    userSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if(!user){
                userData.Password = await bcrypt.hash(userData.Password, 10)
                await db.get().collection(collection.USER_COLLECTION).insertOne(userData)
                resolve(true)
            }else{
                resolve(false)
            }
            
           

        })
    },
    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })

    }
}