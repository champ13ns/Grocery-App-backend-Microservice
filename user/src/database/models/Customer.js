import mongoose , {Schema} from 'mongoose'

const CustomerSchema = new Schema({
    email : { type : String, required : true, unique : true },
    password : { type : String, required : true },
    firstName : { type : String, require : true },
    lastName : { type : String, require : true },
    phone : { type : String },
    salt : { type : String },
    address : [ { type : Schema.Types.ObjectId , ref : 'address', require : true } ],
}, {
    toJSON : {
        transform(doc, ret) {
            delete ret.__v,
            delete ret.password,
            delete ret.salt
        }
    }, timestamps : true
})

const customer = mongoose.model('customer',CustomerSchema)

export  { customer } ;