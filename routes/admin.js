var express = require('express');
var router = express.Router();
var productHelper = require('../Helpers/product-helpers')
var ObjectId = require('mongodb').ObjectId;
const { unlink } = require('node:fs');
const accountHelpers = require('../Helpers/account-helpers');
const fs = require("fs");
const productHelpers = require('../Helpers/product-helpers');

/* GET home page. */
router.get('/', function (req, res, next) {
  productHelper.getAllProducts().then((products) => {
    res.render('admin/view-products', { products, admin: true });

  })
});
//add-products
router.get('/add-products', (req, res, next) => {
  res.render('admin/add-products', { admin: true });
})

router.post('/add-products', (req, res, next) => {

  productHelper.addProduct(req.body, (id) => {
    //adding image if uploaded 
    if (!req.files) {
      console.log('image not uploaded')
      res.render('admin/add-products', { admin: true });
    } else {
      const image = req.files.image
      image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
        if (!err)
          res.render('admin/add-products', { admin: true });
        else (console.log(err))
      })
      console.log('image uploaded')
    }


  })
})

//delete-products

router.get('/delete', (req, res) => {
  let productId = new ObjectId(req.query.id)
  productHelper.deleteProduct(productId, () => {



    fs.access('./public/product-images/' + productId + '.jpg', (err) => {

      if (err) {
        console.log('image does not exists');
      } else {

        unlink('./public/product-images/' + productId + '.jpg', (err) => {
          if (err) throw err;
          else console.log('Image exists and deleted image')

        });
      }
    });
    res.redirect('/admin')
  })
})
/*edit product:>load product details and then edit product attributes */
router.get('/edit', (req, res) => {
  let productId = new ObjectId(req.query.id)
 
  productHelpers.getProductDetails(productId).then((product)=>{
    res.render('admin/edit-products',{product,admin:true})
  })
  
})

router.post('/edit/:id',(req,res)=>{
  const productId=new ObjectId(req.params.id)

  console.log(productId)
  console.log(req.body)
  productHelpers.updateProduct(productId,req.body).then(()=>{
    if(req.files){
      const image=req.files.image
      image.mv('./public/product-images/' + req.params.id + '.jpg', (err, done) => {
       if(err)
       console.log(err)
      })
    }
    res.redirect('/admin')
  })
})

//view users
router.get('/allusers', (req, res) => {
  accountHelpers.getAllUsers().then((users) => {
    res.render('admin/view-users', { admin: true, users })
  })
})

module.exports = router;
