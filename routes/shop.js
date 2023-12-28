const express = require('express');
const shopControllers = require('../controllers/shop');
const isAuthentication = require('../middleware/authentication');
const csrf = require('../middleware/csrf');
const router = express.Router();


router.get('/', shopControllers.getIndex)
router.get('/products', shopControllers.getAllProducts)
router.get('/products/category/:id', shopControllers.getProductsByCategoryId)
router.get('/product/details/:id', shopControllers.getProductById)


router.get('/carts', isAuthentication, shopControllers.getCart)
router.post('/cart/add', isAuthentication,  shopControllers.postCart)
router.post('/remove-cart-item', isAuthentication, shopControllers.postDeleteCartItem)


router.get('/orders', isAuthentication, shopControllers.getOrders);
router.post('/create-order', isAuthentication,   shopControllers.postOrder);

module.exports = router;