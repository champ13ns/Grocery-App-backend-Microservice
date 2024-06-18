import mongoose, { Schema } from 'mongoose'
const OrderSchema = new Schema({
    // products, qty.   
    orderId : { type : String },
    customerId : {type : String},
    customerEmail : { type : String },
    amount : { type : Number},
    status : { type : String },
    items : [
        {
                _id : { type : String , require : true } ,
                vendorId : { type : String, required : true },
                name : { type : String , require : true},
                description :{ type : String ,require : true},
                type : { type : String },
                price: { type : Number },
                brand : { type : String },
                quantity : { type : Number }
        }
    ]
}, {
    timestamps : true,
    toJSON : {
        transform(doc, ret) {
            delete ret.__v,
            delete ret._id
        }
    }
})

const orderModel = mongoose.model('Order',OrderSchema)

export { orderModel };