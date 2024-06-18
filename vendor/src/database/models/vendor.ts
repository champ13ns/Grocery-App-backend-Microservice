import mongoose, { Schema } from "mongoose"

 interface Vendor extends Document {
    email : string,
    firstName : string,
    lastName : string,
    salt : string,
    isVendor : boolean,
    description : string,
    storeName : string,
    contactNumber : string,
    password : string
}


const vendorSchema  = new Schema({
    email : { type : String, require : true, unique : true },
    firstName : { type : String , require : true},
    lastName : { type : String , require : true},
    salt : { type : String, requrie : true },
    isVendor : { type : Boolean, require : true },
    description : { type : String},
    storeName : { type : String, require : true },
    contactNumber: { type : String, require : true },
    password : { type : String, require : true }
})



const vendorModel = mongoose.model<Vendor>('vendor',vendorSchema);

export { vendorModel }