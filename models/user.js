const mongoose = require('mongoose');
const { isEmail } = require('validator');
const Product = require('./product')

const UserSchema = mongoose.Schema({
    userName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        validate:[isEmail, 'Lütfen geçerli bir email adresi giriniz']
    },
    password:{type:String, required:true},

    resetToken:String,
    resetTokenExpiration:Date,
    isAdmin:{
        type:Boolean,
        default:false
    },
    
    cart:{
        items:[
            {
                productId:{ type:mongoose.Schema.Types.ObjectId, required:true, ref:'Product' },
                quantity:{ type: Number, required: true }
            }
        ]
    }

})
UserSchema.methods.getCart = function () {
    const ids = this.cart.items.map(item => {
        return item.productId;
    })
    return  Product
            .find({_id:{$in:ids}})
            .select('productName price imgUrl')
            .then(products => {
                return products.map(p => {
                    return {
                        productName:p.productName,
                        price: p.price,
                        imgUrl:p.imgUrl,
                        quantity:this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity
                    }
                })
            });
}


UserSchema.methods.addToCart = function (product) {
   
     const index = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString()
     });
     const updatedCartItems = [...this.cart.items];
    
     let itemQuantity = 1;
     if(index >= 0)
     {
           itemQuantity = this.cart.items[index].quantity+1;
           updatedCartItems[index].quantity = itemQuantity;
     }
     else
     {
         updatedCartItems.push({
            productId:product._id,
            quantity:itemQuantity
         })
     }
     
     this.cart = { items:updatedCartItems }
     return this.save();

}

UserSchema.methods.deleteCartItem = function (productId) {
    const cartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    })
    this.cart.items = cartItems;
    return this.save();

}

UserSchema.methods.clearCart = function () {
    this.cart = {items: []}
    return this.save();
}

module.exports = mongoose.model('User', UserSchema);