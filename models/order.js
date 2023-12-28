const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user:{
        userId:{
            type:mongoose.Types.ObjectId,
            required:true,
            ref:'User'
        },
        userName:{
            type:String, 
            required:true
        },
        email:{
            type:String,
            required:true
        }
    },
    items:[
        {
            product: {type:Object, required:true },
            quantity: {type:Number, required:true},
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    }
     
})

module.exports = mongoose.model('Order', OrderSchema)