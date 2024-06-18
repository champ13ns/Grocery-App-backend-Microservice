import mongoose, { Schema } from "mongoose";
const vendorSchema = new Schema({
    email: { type: String, require: true, unique: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    salt: { type: String, requrie: true },
    isVendor: { type: Boolean, require: true },
    description: { type: String },
    storeName: { type: String, require: true },
    contactNumber: { type: String, require: true },
    password: { type: String, require: true }
});
const vendorModel = mongoose.model('vendor', vendorSchema);
export { vendorModel };
