const express = require('express')
const adminControllers = require('../controllers/admin');
const isAuthentication = require('../middleware/authentication');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();
// products operations
// get operation 

router.get("/products", adminControllers.getAllProducts)

// insert operation
router.get("/add-product",   adminControllers.getAddProduct)
router.post("/add-product", adminControllers.postAddProduct)

// update operation
router.get("/update-product/:id", adminControllers.getUpdateProduct)
router.post("/update-product",  adminControllers.postUpdateProduct)

// delete operation
router.post("/delete-product",  adminControllers.postDeleteProduct)


// category operations
router.get('/categories',   adminControllers.getCategories)

router.get('/add-category',  adminControllers.getAddCategory)
router.post('/add-category', adminControllers.postAddCategory)

router.get('/update-category/:id', adminControllers.getUpdateCategory)
router.post('/update-category', adminControllers.postUpdateCategory)

router.post("/delete-category", adminControllers.postDeleteCategory)


module.exports = router;