import { authMiddleware } from "./middleware/authMiddleware.js"
import { ShoppingService } from "../service/ShoppingService.js"
import { subscribeMessage, RPCObserver } from "../utils/rabbitMQ.js"
import { cartInputs, orderInputs, wishlistInputs } from "../utils/validInputs.js"
const ShoppingApi = (app, channel) => {
    
    app.use(authMiddleware)

    const serviceLayer = new ShoppingService(channel);

    subscribeMessage(channel,serviceLayer);
    RPCObserver("SHOPPING_RPC", serviceLayer, channel);
                          
    app.post('/cart',async(req,res,next)=>{
        try {
            const itemDetails = req.body;
            const prods = await serviceLayer.ManageCart(req.userId, itemDetails.productId , itemDetails?.quantity ? itemDetails.quantity : 1,true);
            res.json(prods)
        } catch (error) {
            next(error)
        }
    })

    app.delete('/cart',async(req,res,next)=>{
        try {
            const itemDetails = req.body;
            const quantity = req.body?.quantity ? req.body.quantity : 1;
            const prods = await serviceLayer.ManageCart(req.userId, itemDetails._id , quantity,false);
            res.json(prods)
        } catch (error) {
            next(error)
        }
    })

    app.get('/cart', async(req,res,next) => {
        try {
            const cart = await serviceLayer.cartItems(req.userId)
            res.json(cart)
        } catch (error) {
            next(error)
        }
    })

    //wishlist
    app.get('/wishlist', async (req,res,next) => {
        try {
            const wishlist = await serviceLayer.wishlist(req.userId)
            res.json(wishlist);
        } catch (error) {
            next(error)
        }
    })

    app.post('/wishlist',async (req,res,next) => {
        try {
            const wishlistDetails = req.body;
            const prods = await serviceLayer.ManageWishlist(req.userId, wishlistDetails.productId ,true);
            res.json(prods)
        } catch (error) {
            next(error)
        }
    })

    app.delete('/wishlist',async (req,res,next) => {
        try {
            const wishlistDetails = req.body;
            const prods = await serviceLayer.ManageWishlist(req.userId, wishlistDetails._id ,false);
            res.json(prods) 
        } catch (error) {
            next(error)
        }
    })

    //orders

    app.post('/order' , async(req,res,next) => {
        try {
            console.log("start");
            console.log(req.email, req.userId);
            const orderDetails = await serviceLayer.createOrder(req.email, req.userId);
            console.log("orderDetails are ",orderDetails);
            res.json(orderDetails)
        } catch (error) {
            next(error)
        }
    })

    app.get('/order/:orderId' , async(req,res,next) => {
        const orderId = req?.params?.orderId;
        try {
            const orderDetails = await serviceLayer.orderDetailsById(orderId);
            if(orderDetails?.length == 0) res.json({
                "message" : "Invalid Order Id"
            })
            res.json(orderDetails)
        } catch (error) {
            next(error)
        }
    })


    app.get('/order', async(req,res,next) => {
        try {
            const order = await serviceLayer.orderDetails(req.userId);
            res.json(order)
        } catch (error) {
            next(error)
        }
    })

}

export { ShoppingApi }