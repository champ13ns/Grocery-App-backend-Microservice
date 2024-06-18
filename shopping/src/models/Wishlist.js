import mongoose, { Schema } from 'mongoose'
const WishlistSchema = new Schema({
   customerId : { type : String, require : true },
   products : [ {  productId : { type : String, required : true } } ]
}, {
   timestamps : true,
   toJSON : {
      transform(doc, ret) {
         delete ret.__v;
         delete ret._id
      }
   },
})

const wishtlistModel = mongoose.model('wishlist',WishlistSchema)
export { wishtlistModel }