import mongoose, { Schema } from "mongoose";
const CartSchema = new Schema({
  customerId: { type: String },
  products: [
    {
        _id: { type: String, required: true },
        name: { type: String },
        description: { type: String },
        category: { type: String },
        price: { type: Number },
        brand: { type: String },
        quantity: { type: Number },
        vendorId : { type : String, required : true }
    },
  ],
}, {
  timestamps : true,
  toJSON : {
    transform(doc, ret) {
      delete ret.__v
      delete ret._id
    }
  }, timestamps : true
});

const cartModel = mongoose.model("cart", CartSchema);

export { cartModel };
