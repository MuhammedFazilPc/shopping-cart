const db = require('../config/connection')
const collection = require('../config/collection')
const { ObjectId } = require('mongodb')
// imp.connect(()=>{console.log('here too')})
// var x=db.get()
// console.log(x)
// const db=imp.get()
// console.log(db);
// db.collection('samplecollection').insertOne({name:'fazil'})
module.exports = {

    addProduct: (product, callback) => {
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then(() => {
            var id = product._id

            callback(id);
        })
    },

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            // console.log(products)
            resolve(products)

        })
        //    console.log(products)
    },
    deleteProduct: (productId, callback) => {
        db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: productId }).then((deletedId) => {
            // console.log('deleted' + deletedId)
            callback()
        })
    },
    getProductDetails: (productId) => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: productId })
            resolve(product)
        })
    },
    updateProduct: (productId, product) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: productId }, {
                $set: {
                    Name: product.Name,
                    Type: product.Type,
                    Description: product.Description,
                    Price: product.Price,

                }
            })
            resolve()

        })

    },
    pushCartProduct: (userId, productId) => {
        userId=new ObjectId(userId)
        productId= new ObjectId(productId)
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.CART_COLLECTION).findOne({ userId:  userId })
            if (user) {
                //   console.log('user alread have cart,just push product to cart')
                await db.get().collection(collection.CART_COLLECTION).updateOne({ userId: userId }, { $push: { productId: productId } })
                resolve()
            } else {
                await db.get().collection(collection.CART_COLLECTION).insertOne({ userId: userId, productId: [productId] })
                // console.log('prduct pushed to cart');
                resolve()
            }
        })
    },
    showCartProducts: (userId) => {
        userId=new ObjectId(userId)
        let i=0;
        // console.log(userId)
        return new Promise(async (resolve, reject) => {
           let products = await db.get().collection(collection.CART_COLLECTION).findOne({ userId: userId })
        //    console.log(products)
        //    console.log(products.productId)
           if (products){
            
           let productsDatails=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:{$in:products.productId}})
        //    console.log(productsDatails)
            resolve(productsDatails)
           }else{
            console.log('cart is empty');
           }
        })
    },
    totalCartProducts:(userId)=>{
        userId=new ObjectId(userId)
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.CART_COLLECTION).findOne({ userId: userId })
        
            resolve(products.productId.length)
           
        })
    }
}