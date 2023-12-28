const mongoose = require('mongoose');
const { isEmail } = require('validator');

const LoginSchema = mongoose.Schema({
    email:{
        type:String,
        required: [true, 'Lütfen email adresi giriniz!'],
        validate:[isEmail, 'Lütfen geçerli bir email adresi giriniz!']
    },
    password:{
        type:String, 
        required:[true, 'Lütfen parolanızı giriniz!'] 
        },


})

module.exports = mongoose.model('Login', LoginSchema);