var express = require('express');
const alert=require('alert')
var router = express.Router();
var productHelper=require('../Helpers/product-helpers')
var accountHelper=require('../Helpers/account-helpers');
const productHelpers = require('../Helpers/product-helpers');



const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET users listing. */
router.get('/', async function(req, res, next) {
  let user=req.session.user
 let cartSize=null
  if(user){
   cartSize=await productHelpers.totalCartProducts(user._id)
    console.log(cartSize)
    // productHelpers.totalCartProducts(req.session.user._id)
  }
  productHelper.getAllProducts().then((products)=>{
    // res.render('user/view-products',{products,admin:false,user,cartSize})
    res.render('user/view-products',{products,admin:false,user,cartSize})
  })
  
});
//sign up
router.get('/signup',(req,res,next)=>{
  res.render('user/signup',{admin:false,signupErr:req.session.signupErr})
  req.session.signupErr=false
})
router.post('/signup',(req,res,next)=>{ 
    
      accountHelper.userSignup(req.body).then((insert)=>{
       if(insert){
        req.session.loggedIn=true;
        req.session.user=req.body
        res.redirect('/')
       }else{
        req.session.signupErr=true;
        res.redirect('/signup')
       }
        
      })
      
})

//login
router.get('/login',(req,res,next)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{

    res.render('user/login',{admin:false,loginErr:req.session.loginErr})
    req.session.loginErr=false

  }
  
})


router.post('/login',(req,res,next)=>{
      accountHelper.userLogin(req.body).then((response)=>{
        if(response.status){
               req.session.loggedIn=true;
               req.session.user=response.user;
              //  console.log(response.user)
              res.redirect('/')
        }else{
          req.session.loginErr=true;
          res.redirect('/login')
        }
      })
})

//cart

//1.add product to cart
router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  productHelpers.pushCartProduct(req.session.user._id,req.params.id).then(()=>{
   res.redirect('/cart')
  })
})

//2.show cart products
router.get('/cart',verifyLogin,(req,res)=>{
  productHelpers.showCartProducts(req.session.user._id).then((cartProducts)=>{
    //user is passed to get the usr name on navbar
    console.log(cartProducts)
    res.render('user/cart',{user:req.session.user,cartProducts:cartProducts})
  })
  
})

//orders
router.get('/orders',verifyLogin,(req,res)=>{
  res.render('user/orders',{user:req.session.user})
})
//logout
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
module.exports = router;
