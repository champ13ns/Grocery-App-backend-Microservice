import mongoose, { Document, Schema} from "mongoose"

export interface ReceivedOrder {
    vendorId: String;
    pendingOrders: Array<{
        orderId: String;
        customerId: String;
        customerEmail : String,
        items: Array<{
            productId: String;
            quantity: Number;
        }>;
    }>;
}

const vendorOrderSchema = new Schema({
    // order details.
    vendorId : { type : String },
    pendingOrders : [
        {
            orderId : { type : String },
            customerId : { type : String, require : true },
            customerEmail : { type : String, require : true },
            items : [{
                productId : { type : String },
                quantity : { type : Number },
            }]
        }
    ]
})

const orderModel = mongoose.model<ReceivedOrder>('order', vendorOrderSchema);


export { orderModel }