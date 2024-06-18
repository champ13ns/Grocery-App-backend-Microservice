import { ProductRepo } from "../repository/product-repo.js";
import { ValidationError } from "../utils/appError.js";

class ProductService {
  constructor() {
    this.repository = new ProductRepo();
  }
  async addProdcut(prodDetails) {
    return await this.repository.addProduct(prodDetails);
  }
  async updateProduct(productId, prodDetails) {
    return await this.repository.updateProduct(productId, prodDetails);
  }
  async removeProduct(productId, vendorId) {
    return await this.repository.removeProduct(productId, vendorId);
  }

  async FindProductById(productId) {
    return await this.repository.getProductById(productId);
  }

  async bulkAdd(productDetails) {
    return await this.repository.bulkAdd(productDetails);
  }

  async getProduct(productName, category, brands, page, limit, sortArr) {
    return await this.repository.getProduct(
      productName,
      category,
      brands,
      page,
      limit,
      sortArr
    );
  }

  
  async serveRPCRequest(payload) {
    const { type, data } = payload;
    switch (type) {
      case "VIEW_PRODUCT":
        return await this.repository.getProductById(data, true);
      case "ADD_PRODUCT":
        return await this.repository.addProduct(data, true);
      case "BULK_ADD":
        return await this.repository.bulkAdd(data, true);
      default:
        return "Event does not exist";
    }
  }
}

export { ProductService };
