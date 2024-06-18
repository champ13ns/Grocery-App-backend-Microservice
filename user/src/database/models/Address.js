import mongoose , { Schema } from 'mongoose'

const AddressSchema = new Schema({
    street : { type : String, require : true },
    pinCode : { type : String, require : true },
    city : { type : String, require : true },
    houseNumber: { type : Number, required : true }
}, {
     toJSON : {
        transform(doc, ret) {
            delete ret.__v
        }
     },
      timestamps : true
})

const address = new mongoose.model('address',AddressSchema);

export { address };