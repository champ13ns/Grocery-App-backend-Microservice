import { vendorModel } from "../database/models/vendor";
import { orderModel } from "../database/models/index";
import { ProductInputs, SignUpInputs } from "../utils/index";
import { globalObj } from "../utils/index";
import { RPC_Request } from "../utils/rabbitMQ";
import { ReceivedOrder } from "../database/models/order";
import { sendMail } from "../utils/email";

import {
  validatePassword,
  generateSignature,
  generateSalt,
  generatePassword,
} from "../utils/index";
import { v4 } from "uuid";

interface OrderDetailsInputs{
     orderId : String,
     customerId : String,
     customerEmail : String,
     amount : Number,
     status : String,
     items : [{
      _id : String,
      vendorId : String,
      description : String,
      price : Number,
      quantity : Number
     }]
}


class VendorRepository {

  async findUserByEmail(email : string) {
    return await vendorModel.findOne({email : email})
  }

  async createNewUser(userInputs: SignUpInputs) {
      const salt = await generateSalt();
      const hashedPassword = await generatePassword(userInputs.password, salt);
      const dbInputs = { ...userInputs, password: hashedPassword, salt };
      const newVendor = await vendorModel.create(dbInputs);
      return newVendor;
  }

  async addProduct(productInfo: ProductInputs) {

      const payload = {
        type: "ADD_PRODUCT",
        data: productInfo,
      };
      const res = await RPC_Request("PRODUCT_RPC", payload, v4());
      return res;
    
  }

  async bulkAdd(productInfo: any) {
      const payload = {
        type: "BULK_ADD",
        data: productInfo,
      };
      return await RPC_Request("PRODUCT_RPC", payload, v4());
    
  }

  async productById(productId: string) {
      return await RPC_Request(
        "PRODUCT_RPC",
        { type: "PRODUCT_INFO_BY_ID", data: productId },
        v4()
      );
  }

  async productInfo(page: number, limit: number, sort: boolean) {
      return await RPC_Request(
        "PRODUCT_RPC",
        { type: "GET_PRODUCT", data: { page, limit, sort } },
        v4()
      );
   
  }

  async manageOrder( data: OrderDetailsInputs) {
      // order Details -> array -> store details of order in vendor DB.
      const items = data.items;
      const customerId = data.customerId;
      const orderId = data.orderId;
      const customerEmail = data.customerEmail

      for(const item of items) {
        const vendorId = item.vendorId;
        
        const existingOrder = await orderModel.findOne({vendorId : vendorId});

        if(existingOrder === null){
          const newOrder : ReceivedOrder =  {
            vendorId ,
            pendingOrders : [{
              orderId,
              customerId,
              customerEmail ,
              items : [{
                productId : item._id,
                quantity : item.quantity
              }]
            }]
          }
          await sendMail(customerEmail, data)
          const neworder =  await orderModel.create(newOrder)
          return { neworder , "mssg" : "Order details are sent to your mail id"}
        }  else {
          const pendingOrders   = existingOrder.pendingOrders
          const existingOrderId = pendingOrders.find(orders => orders.orderId === orderId);
          console.log("existingORder id is ",existingOrder)
          if(existingOrderId) {
            //@ts-ignore
            existingOrder.items.push({
              productId : item._id,
              quantity : item.quantity
            })
          } else{
            const newOrder = {
              orderId,
              customerId,
              customerEmail,
              items : [{ productId : item._id, quantity : item.quantity }]
            }
            // @ts-ignore
            await existingOrderId?.pendingOrders?.push(newOrder) ;
          }
          await sendMail(customerEmail, data)

          const updateOrder = await existingOrder.save();
          return {updateOrder, "mssg" : "Order details are sent to your mail id"};
          // send email to customer, notifying order details are sent to vendor.
        }
      }
  }

  async pendingOrderDetails(vendorId : string, page : number, limit : number) {
    return await orderModel.find({vendorId}).skip((page-1) * 10).limit(limit);
  }
}

export { VendorRepository };
