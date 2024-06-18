import mongoose , { Schema } from 'mongoose'

const ProductSchema = new Schema({
    name : { type : String , require : true },
    category : { type : String, require: true },
    price : { type : Number, require : true },
    description : { type : String, require : true },
    availableUnit : { type :  Number,require: true},
    brand : { type : String },
    available : { type : Boolean, default : true },
    vendorId : { type : String  }
}, {
    toJSON : {
        transform(doc , ret) {
            delete ret.__v
        }
    }, timestamps : true
})


const product = mongoose.model('product',ProductSchema);


export { product }