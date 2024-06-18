import { verifySignature } from "./middleware/index.js"
import { ProductService } from "../service/product-service.js";
import { RPCObserver } from './../utils/rabbitMq.js'
import { APIError, ValidationError,NotFoundError,AuthorizeError } from "../utils/appError.js";
import { newProductInput, updateProductInput } from "../utils/validInputs.js";
const checkIsVendor =(req,res,next) => {
        {
            if(req.isVendor === undefined || req?.isVendor === false) {
                console.log(req?.isVendor)
                throw new AuthorizeError("Not authorized")
            } else next()
        }
}

const productApi = (app)=>{
    
    const service = new ProductService();
    app.use(verifySignature);

    RPCObserver("PRODUCT_RPC",service)

    app.post('/product',checkIsVendor,  async (req,res,next) => {
        try {
            const productDetails = req.body;
            const isValid = newProductInput.safeParse(productDetails);
            if(isValid.success === false){
                // res.json(new AuthorizeError("VEndor ROUTE "))
                console.log(isValid.error)
                throw new ValidationError(JSON.stringify(isValid.error))     
            }
            const detailsWithVendorId = {...productDetails, vendorId : req.vendorId}
            const product = await  service.addProdcut(detailsWithVendorId)
            res.json(product)
        }
        catch (error) {
           next(error)
       }
    })

    app.get('/product' , async(req,res,next) => {
        let category = req.query?.category || null;
        category ? category = category.split(",") : category;
        let productName = req.query.name || null;
        productName ? productName = productName.replace(/,/g, ' ') : productName
        let brands = req.query.brand || null;
        brands ? brands = brands.split(",") : brands;
        const page = req.query.page || 1;
        const limit = req.query?.limit || 10
        const productByCategories = await service.getProduct(productName, category,brands, page,limit, null)
        res.json(productByCategories)
    })
    
    app.get('/productById', async(req,res,next) => {
        try{
            const productIds = req.query?.id || null;
            if(productIds == null) throw new ValidationError("No product Id passsed in request query")
            let productArr = productIds.split(",") 
            const productByCategories = await service.FindProductById(productArr)
            res.json(productByCategories)  
        } catch(error){
              next(error)
        }
    })


    app.put('/product/:productId',async(req,res,next) => {
        try {
            const productId = req.params?.productId;
            console.log("productId is ",productId);
            checkIsVendor(req,res,next)
            if(productId === undefined) throw new NotFoundError("Product Id not preset")
            const validProduct = await service.FindProductById(productId);
              if(validProduct === null) throw new ValidationError("Invalid Product Id")
            if(validProduct.vendorId !== req.vendorId) throw new AuthorizeError("This product belongs to some other vendor")
            const validInputs = updateProductInput.safeParse(req.body);
            if(validInputs.error === true){
                throw new ValidationError(JSON.stringify(validInputs.data)) 
            }
           res.json(service.updateProduct(productId, req.body))
        } 
        catch (error) {
             next(error);   
        }
    })

 
    app.delete('/product/:productId',checkIsVendor, async(req,res,next) => {
        try {
            if(!req.params?.productId) throw new NotFoundError("Please enter product id")
            res.json(await service.removeProduct(req.params.productId, req.vendorId));
        } catch (error) {
            next(error)
        }
            
    })

}

export { productApi }