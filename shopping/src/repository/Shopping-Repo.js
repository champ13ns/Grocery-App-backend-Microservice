import { orderModel, wishtlistModel, cartModel } from "./../models/index.js";
import { v4 as randomId } from "uuid";
import { RPC_Request } from "../utils/rabbitMQ.js";
import { ValidationError } from "../utils/error/appError.js";
import mongoose from "mongoose";
import { channel } from "../utils/rabbitMQ.js";
class ShoppingRepository {

  async ManageCart(customerId, productId, quantity, isAdd,productDetails) {
    if (isAdd == true) {
      const existingCart = await cartModel.findOne({customerId })
      if(!existingCart) {
        const newCartItem = {
          "customerId" : customerId,
          products : [{...productDetails, "quantity" : quantity}]
        }
      return await cartModel.create(newCartItem);
      } else  {
        const existingProductsInCart = existingCart.products;
        const alreadyPresentItem = existingProductsInCart.filter((prod) => prod._id === productId);
        if(alreadyPresentItem.length === 0) {
          existingProductsInCart.push({...productDetails, "quantity" : quantity})
        } else {
          alreadyPresentItem[0].quantity += quantity;
        }
        return await existingCart.save();
      }
    } 
    else {
      // remove From cart.
      const cartItems = await cartModel.findOne({ customerId });  
      if(!cartItems) throw new ValidationError("No Elements in cart!!")
      const existingProducts = cartItems.products;
      if(existingProducts.length === 0) throw new ValidationError("No Elements in cart!!")

      const updatedProducts = existingProducts.map((p) => {
        if(p._id === productId) {
           if(quantity < p.quantity) p.quantity -= quantity;
           else return null
        }
        return p
      }).filter((p) => p !== null)
      cartItems.products = updatedProducts
      const updatedList = await cartItems.save();
      return updatedList;
    }
  }

  async getCartDetails(customerId) {
    return await cartModel.findOne({ customerId });
  }

  async ManageWishlist(customerId, productId, isAdd) {
    const validId = mongoose.Types.ObjectId.isValid(productId);
    if(!validId) throw new ValidationError("Invalid product Id")
    if (isAdd === true) {
      // add Item to wishlist.
        const existingWishlist = await wishtlistModel.findOne({ customerId });
        if (!existingWishlist || existingWishlist.products.length == 0) {
          if(existingWishlist === null) {

            let productArr = [{productId}];
            const newWishlistItem = {
              customerId,
              products: productArr,
            };
  
            const newItem = await wishtlistModel.create(newWishlistItem);
            console.log("new item...",newItem);
            return newItem;
          } else {
            existingWishlist.products.push({productId})
            return await existingWishlist.save();
          }

        } else {
            let existingWishlistItems = existingWishlist.products;
            const existingProductInWishlist = existingWishlistItems.filter((p) => p.productId === productId);
            if(existingProductInWishlist.length > 0) throw new ValidationError("Product already exist in wishlist")
              else {
              const updatedList = [...existingWishlistItems, {"productId" : productId}];
                existingWishlist.products = updatedList;
                return await existingWishlist.save()
              }
            }
    } 
    else {
      const wishlistItems = await wishtlistModel.findOne({customerId})
      const productsInWishlist = wishlistItems.products;
      const updatedList = productsInWishlist.filter((prod) => prod.productId !== productId);
      if(updatedList.length === productsInWishlist.length) throw new ValidationError("Product Doesn't exist in wishlist")
        else {
          wishlistItems.products = updatedList;
          const updatedWishlist =  await wishlistItems.save();
          return updatedWishlist
         }
    }
  }

  async GetWishlistByCustomerId(customerId) {
    return await wishtlistModel.findOne({ customerId });
  }


  async OrderDetails(customerId) {

    return await orderModel.find({customerId})
  }

  async orderDetailsById(orderId){
    return await orderModel.find({orderId});
  }


  async CreateNewOrder( email,  customerId ) {

    const orderId = randomId();
    const cartItems = await cartModel.findOne({ customerId});
    const items = cartItems?.products;
    
    if(items.length == 0) {
     throw new ValidationError("Cart is empty, please add some items in cart first")
    }
    let totalAmount = 0;
    items.forEach((item) => totalAmount += (item.price * item.quantity));
    const newOrder = {
      orderId,
      customerId,
      customerEmail : email,
      amount : totalAmount,
      status : "recieved",
      items 
    }
    const orderDetails = await orderModel.create(newOrder);
    console.log("new ORder is ",orderDetails);
    cartItems.products = []; 
    await  cartItems.save(); // empty the cart.

    // send order details to vendor service

    const payload = {
      event : 'SEND_TO_VENDOR',
      data : orderDetails
    }

    await RPC_Request("VENDOR_RPC",channel,JSON.stringify(payload));
    return {orderDetails, message : "Order details send to vendor"};

  }

  async DeleteUserData(customerId) {
      const removeCartItems =  await cartModel.deleteMany({ "customerId": customerId });
      const removeOrderDetails =  await orderModel.deleteMany({ "customerId" : customerId });
      const removeWishlistDetails = await wishtlistModel.deleteMany({"customerId" : customerId});
      return { "message" : "Order details, cart items and wishlist items deleted" }
}
}

export { ShoppingRepository };
