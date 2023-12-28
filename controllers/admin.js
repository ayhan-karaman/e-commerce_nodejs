const  mongoose  = require('mongoose');
const Category = require('../models/category');
const Product = require('../models/product');
const fs = require('fs');


module.exports.getAddProduct = (req, res, next) => {
        Category.find()
        .then(categories => {
            res.render('admin/add-product', {
                title:'Add Product',
                categories:categories,
                
                inputs:{
                    productName:'', 
                    price:'', 
                    description:''
                }
            })
        })
        .catch(err => next(err));  
}

module.exports.postAddProduct = (req, res, next) => {
       const categoryIds =  req.body.categoryId;
       const productName = req.body.productName;
       const price =  req.body.price;
       const description = req.body.description;
       const file =  req.file;
       const user = req.user
       if(!file)
       {
       return Category.find()
        .then(categories => {
            const ids = typeof categoryIds == 'string' ? [categoryIds] : categoryIds == undefined ?  [] : categoryIds; 
                 categories = categories.map(category => {
                    
                         ids.find(item => {
                            if(item.toString() === category._id.toString())
                                category.selected = true;
                        })
                    return category;
            })
             res.render('admin/add-product', {
                title:'Add Product',
                errorMessage : 'Lütfen bir resim seçiniz!',
                categories:categories,
                inputs:{
                    productName:productName, 
                    price:price, 
                    description:description
                }
            })
        })
        .catch(err => next(err)); 
       }

     const product = new Product({
        categories:categoryIds,
        productName:productName, 
        price:price, 
        description:description, 
        imgUrl:file.filename,
        userId:user

     })
    product.save()  
    .then(() => {
        res.redirect('/admin/products?action=added')
    })
    .catch(err => {
          if(err.name == 'ValidationError')
          {
            let message = "";
            for (field in err.errors) {
                message += err.errors[field].message + '\n<br/>'
            }
            Category.find()
            .then(categories => {

                 const ids = typeof categoryIds == 'string' ? [categoryIds] : categoryIds == undefined ?  [] : categoryIds; 
                 categories = categories.map(category => {
                    
                         ids.find(item => {
                            if(item.toString() === category._id.toString())
                                category.selected = true;
                        })
                    return category;
                })
                res.render('admin/add-product', {
                    title:'Add Product',
                    categories:categories,
                    errorMessage:message,
                    inputs:{
                        imgUrl:'',
                        productName:productName, 
                        price:price, 
                        description:description, 
                    }
                })
            
            })
           
          }
          else{
             next(err)
          }
          
    });
}

module.exports.getAllProducts = (req, res, next) => 
{
        Product
        .find({userId:req.user._id})
        .then(products => {
            res.render('admin/products', {
                title:'Admin Products',
                products:products,
                action: req.query.action
            })
        })
        .catch(err => next(err));
        
}

module.exports.getUpdateProduct = (req, res, next) => {
    
            Product.findOne({_id:req.params.id, userId: req.user._id})
            .then(product => {
                if(!product)
                    return res.redirect('/');
                return product
            })
            .then(product => {
                Category.find()
                .then(categories => {
                    categories = categories.map(category => {
                        if(product.categories)
                        {
                            product.categories.find(item => {
                                if(item.toString() === category._id.toString())
                                    category.selected = true;
                            })
                        }

                        return category;
                    })
                    
                        res.render('admin/update-product', {
                        title:'Update Product',
                        categories:categories,
                        product:product
                    })
                })
                .catch(err => next(err))
            })
            .catch(err => next(err))
            
   
}

module.exports.postUpdateProduct = (req, res, next) => {
            const id = req.body.id;
            const categoryId =  req.body.categoryId;
            const productName = req.body.productName;
            const price =  req.body.price;
            const description = req.body.description;
            const file =  req.file;
        

        Product.findOne({_id:id, userId:req.user._id})
        .then(product => {
                if(!product)
                {
                    return res.redirect('/')
                }
                product.productName = productName;
                product.categoryId =  categoryId;
                product.productName = productName;
                product.price =  price;
                product.description = description;
                if(file)
                {
                    fs.unlink('public/img/'+ product.imgUrl, err =>{
                        if(err)
                        {
                             next(err);
                        }
                    })
                     product.imgUrl = file.filename;
                }
                return product.save()
                
            })
            .then(() => {
                res.redirect('/admin/products?action=edit')
            })
            .catch(err => next(err));
       
   
}

module.exports.postDeleteProduct = (req, res, next) => {
    
     Product.findOne({_id:req.body.id, userId: req.user._id})
     .then(product => {
            if(!product)
            {
                return next(new Error('Ürün bulunamadı'));
            }
            fs.unlink('public/img/'+ product.imgUrl, err =>{
                if(err)
                {
                     next(err);
                }
            })
           return Product.deleteOne({_id:req.body.id, userId: req.user._id})
     })
     .then((result)=> {
            if(result.deletedCount === 0)
            {
                return next(new Error('Ürün bulunamadı'));
            }
            res.redirect('/admin/products?action=delete')
        })
        .catch(err => next(err))
    
}


module.exports.getCategories = (req, res, next)=>{
    Category.find()
    .then(categories => {
        res.render('admin/categories', {
            title:'Admin Categories',
            categories:categories
        })
    })
}


module.exports.getAddCategory = (req, res, next) => {
     res.render('admin/add-category', {
        title:'Add Category Page'
     })
}

module.exports.postAddCategory = (req, res, next) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    })
    category.save()
    .then(() => {
      res.redirect('/admin/categories')
    })
     .catch(err => next(err))
    
}


module.exports.getUpdateCategory = (req, res, next) => {
      Category.findById({_id:req.params.id})
      .then(category => {
        res.render('admin/update-category', {
            title:'Add Category Page',
            category:category
         })
      })
      .catch(err => next(err));
}

module.exports.postUpdateCategory = (req, res, next) => {
      Category.findByIdAndUpdate({_id:req.body.id}, {
        $set:{
            name:req.body.name,
            description: req.body.description
        }
      })
      .then(() => {
        res.redirect('/admin/categories')
      })
      .catch(err => console.log(err))
}

module.exports.postDeleteCategory =  (req, res, next) => {
    Category.findByIdAndDelete({_id:req.body.id})
    .then(() => {
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
}