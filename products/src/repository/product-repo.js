import mongoose from "mongoose";
import { product } from "../database/models/Product.js";
import { NotFoundError, ValidationError } from "../utils/appError.js";
class ProductRepo {
  async addProduct(productDetails) {
    // check if that product already exists in db?
    // check if db contains product with same Supplier, Name, Desc, Price and Type already exists
    const { brand, category, availableUnit,vendorId,  name, description, price, type } = productDetails;
    const existingProduct = await product.find({
      brand,
      name,
      description,
      price,
      type,
      vendorId,
      availableUnit
    });
    if (existingProduct.length > 0) {
      throw new ValidationError("Product already exist!!!")
    }
    const newProduct = await product.create(productDetails);
    return newProduct;
  }

  async bulkAdd(productDetails){
    try {
      let addedProds = []
      let existinProds = []
      productDetails.map(async (singleProdInfo) => {

      const { brand, category,  name, description, price } = singleProdInfo;
      const existingProduct = await product.find({
        brand,
        name,
        description,
        price,
        category,
      });
    if (existingProduct.length > 0) {
      existinProds.push(existingProduct);
    } else {
      const newProduct = await product.create(singleProdInfo);
      addedProds.push(newProduct)
    }
  })
  return { addedProds, existinProds }
    } catch (error) {
      throw error;
    }
  }


  async getProduct(productName, categories, brands, page, limit , sortArr){

      let productMatch = productName ? { $match : { $text : {  $search :   productName  } } } : { $match : {}}
      const skipRes = (page - 1) * 10; // assuming 10 products per page are displayed.
      let categoryDB = categories ? { category: { $in: categories } } : { category: { $exists: true } };
      console.log("cat DGb is ....",categoryDB)
      let brandsDB = brands ? { brand : { $in : brands } } : { brand : { $exists : true } };
      const result = await product.aggregate([ 
        productMatch,
        { $match : categoryDB },
        { $match : brandsDB },
        {$sort : { price : -1 }},
        { $skip : skipRes },
        {$limit : limit}
      ])
      console.log("response is ",result)
      return result;
      
  }

  async updateProduct(productId , newProdDetails) {
    const productDetails = await product.findOneAndUpdate({_id : productId}, {$set : newProdDetails})
    if(!productDetails){
      return {
        message : "Product doesn't exist"
      }
    }
    return product.findById({_id : productId})
  }

  async removeProduct(productId, vendorId) {
    if(!ObjectId.isValid(productId)) throw new ValidationError("Invalid product id");
    const productToBeDeleted = await product.findById({_id : productId});
    if(!productToBeDeleted) throw new NotFoundError("No Product exists with this id");
    if(productToBeDeleted.vendorId  !== vendorId) throw new ValidationError("This product belongs to some other vendor")
    const delProdcut = await product.findByIdAndDelete({ _id: productId });
    return delProdcut;
  }

  async getProductByCategory(category,page,limit) {
    console.log("cat is ",category);
    const prod = await product.find({ category : category }).skip((page - 1)*10).limit(limit);
    return prod;
  }

  async Products(page, limit) {
    return await product.find().skip((page-1)*10).limit(limit);
  }

  async getProductById(productIdArr, isRPC ) {
    
    console.log("productId arr is ",productIdArr)

    const validProductIds = productIdArr.filter((productId) => mongoose.Types.ObjectId.isValid(productId))
    if(validProductIds.length === 0)  {
      if(isRPC === true) {
        return {
          data : null,
          error : "All product ids are invalid"
        }
      }
      throw new ValidationError("All product ids are invalid")
    }
    const products = await product.find({ _id :  { $in : validProductIds }})
    console.log("products by Id's are......",products)
    return {
      products 
    }
  
  }

  async FindSelectedProducts(productIds) {
    // array of productId's []
    let response = [];
    for (let i = 0; i < productIds.length(); i++) {
      const productInfo = await product.findById({ _id: productIds[i] });
      response.push(productInfo);
    }
    return productInfo;
  }
}

export { ProductRepo };


// db.products.aggregate([ { $match: { $or : [

// ] } }, 
// { $match: { brand: { $in : ["JBL", "Corsair"] }  }  },
// { $match : { price : { $gte : 10 , $lte : 1000 } } },
// { $sort : { price : 1 } },
// { $project : { name : 1, price :1 ,category : 1 , available : true } }
// ])
