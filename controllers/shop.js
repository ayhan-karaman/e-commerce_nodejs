const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');



module.exports.getIndex = (req, res, next) =>{
     Product.find().then(products => {
        Category.find().then(categories => {
            res.render('shop/index', {
                title:'Home Page',
                products:products,
                categories: categories
            
            })
        })
        .catch(err => next(err))
     })
     .catch(err => next(err))         
    
}

module.exports.getAllProducts = (req, res, next) =>{
            Product.find()
            .then(products => {
            Category.find()
            .then(categories => {
                res.render('shop/products', {
                    title:'Products',
                    products:products,
                    categories: categories
                })
            })
            .catch(err => next(err))  
            })
            .catch(err => next(err)) ;
           
                
}

module.exports.getProductsByCategoryId = (req, res, next) =>{
        const categoryId = req.params.id;
        Product.find({categories:categoryId})
        .then(products => {
            Category.find()
            .then(categories => {
                 category = categories.find(i => i._id.toString() === categoryId.toString());
                
                res.render('shop/products', {
                    title:`${category.name == "" ? "Not Product" : category.name}`,
                    products:products,
                    selectedCategory:categoryId,
                    categories:categories
                })
            })
            .catch(err => next(err))
        })
        .catch(err => next(err))
}

module.exports.getProductById = (req, res, next) =>{
        Product.findById({_id:req.params.id})
        .then(product => {
            res.render('shop/details', {
                title:product.productName,
                product:product
            })
        })
        .catch(err => next(err)); 
}

exports.getCart = (req, res, next) => {

    req.user  
    .populate('cart.items.productId')
    .then(user => 
        {
            res.render('shop/cart', 
            {
                title:'Cart Page',
                path:'/carts',
                products:user.cart.items
            })
        }
        )
    .catch(err => next(err))

   
}
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
  
    Product.findById(productId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(()=> {
        res.redirect('/carts')
    })
    .catch(err => next(err))
}

exports.postDeleteCartItem =(req, res, next) => {
    const productId = req.body.id;
    req.user
    .deleteCartItem(productId)
    .then(() => {
        res.redirect('/carts')
    })
    .catch(err => next(err))
}


module.exports.getOrders = (req, res, next) => 
{
     Order.find({'user.userId': req.user._id})
     .then(orders => {
        res.render('shop/orders', {
            title:'Orders',
            path:'/orders',
            orders:orders
         })
     })
     .catch(err => next(err))
     
}

module.exports.postOrder = (req, res, next) => 
{
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const order = new Order({
            user:{
                userId:req.user._id,
                userName:req.user.userName,
                email:req.user.email
            },
            items:user.cart.items.map(p => {
                return {
                    product:{
                        _id:p.productId._id,
                        productName:p.productId.productName,
                        price:p.productId.price,
                        imgUrl:p.productId.imgUrl
                    },
                    quantity:p.quantity
                }
            })
        })
        return order.save();
    })
    .then(() => {
        return req.user.clearCart();
    })
     .then(() => {
        res.redirect('/orders')
    })
    .catch(err => next(err))
}