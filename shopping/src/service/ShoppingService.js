import { ShoppingRepository } from "../repository/Shopping-Repo.js"
import { RPC_Request } from "../utils/rabbitMQ.js";

class ShoppingService{
     channel;
    constructor(channel){
        this.channel = channel
        this.repository = new ShoppingRepository();
    }
    
    async ManageCart(customerId, productId, quantity, isAdd){
        const productDetails = await RPC_Request("PRODUCT_RPC", this.channel,  {
            type: "VIEW_PRODUCT",
            data: [productId],
        });
        console.log("prodoctDetails are ",productDetails.products[0])
        return await this.repository.ManageCart(customerId,productId,quantity,isAdd, productDetails.products[0])
    }
    
    async ManageWishlist(customerId, productId, isAdd){
        return await this.repository.ManageWishlist(customerId,productId,isAdd)
    }

    async cartItems(customerId){
        return await this.repository.getCartDetails(customerId)
    }

    async wishlist(customerId) {
        return await this.repository.GetWishlistByCustomerId(customerId)
    }

    async orderDetails(customerId) {
        return await this.repository.OrderDetails(customerId)
    }

    async createOrder(customerEmail, customerId){
        return await this.repository.CreateNewOrder(customerEmail,  customerId)
    }
    async orderDetailsById(orderId){
        return await this.repository.orderDetailsById(orderId)
    }

    async SubscribeEvents(payload) {
        payload = JSON.parse(payload);
        console.log("payload recvd is ",payload);
        const { event, data } = payload;
        switch(event){
            case "ADD_TO_CART":
                await this.repository.ManageCart(data?.userId,data?.productId,data?.qty,true);
                break;
            case "REMOVE_FROM_CART":
                await this.repository.ManageCart(data?.userID,data?.productId,data?.qty,false);
                break;
            case "DELETE_CUSTOMER_INFO":
                const del = await this.repository.DeleteUserData(data);
                return del;
                break;
            default:
                break;
        }
    }

}

export { ShoppingService }