const mongoose = require('mongoose');
const ProductSchema = mongoose.Schema(
    {
        productName:
        {
            type: String,
            required: [true, 'Ürün adı boş geçilemez!'],
            minlength:[5, 'Ürün adı içi minimum 5 karakter giriniz!'],
            maxlength:[255, 'Ürün adı için maksimum 255 karakter giriniz!'] 
        },
        price:{
            type:Number,
            required:[function () {
                return this.isActive
            }, 'Ürün bilgisi boş geçilemez'],
            min:[1, 'Fiyat bilgisi için minimum 1 giriniz!'],
            max:[10000000, 'Fiyat bilgisi için maksimum 10000000 giriniz!']
        },
        description:{ type:String, minlength:[10, 'Açıklama için minimum 20 karakter giriniz!'], maxlength:[100000, 'Açıklama için maksimum 20 karakter giriniz!'] },
        imgUrl:String,
        date:{
            type:Date,
            default:Date.now
        },
        categories :{
            type:[ {
            type: mongoose.Schema.ObjectId,
            ref : 'Category',
        }],
         validate:{
            validator:function (value) {
                return value && value.length > 0;
            },
            message:'Lütfen en az bir kategori seçiniz!'
         }
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref : 'User',
            required : true
        },
        isActive:{
            type:Boolean,
            default:true
        }
    
    }
);

module.exports = mongoose.model('Product', ProductSchema)