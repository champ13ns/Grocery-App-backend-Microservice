//
import { VendorRepository } from "../repository/vendorRepostory";
import { VendorLoginInput, VendorSignUpInput, ProductInputs, ProductInput, validatePassword, generateSignature } from "../utils/index";
import { AuthorizeError, ValidationError } from "../utils/appError";
import { globalObj } from "../utils/index";

class VendorService {
     vendorRepo;  

    constructor(){
        this.vendorRepo = new VendorRepository();
    }

    async signIn(email : string, password : string){
        const existingUser = await this.vendorRepo.findUserByEmail(email);
        if(!existingUser) {
                throw new ValidationError("Email Doesn't exist");
        }
        const correctPass = await validatePassword(password,existingUser.salt,existingUser.password);
        if(!correctPass) throw new ValidationError("Wrong Password Entered")
        const payload = {
            id : existingUser._id,
            email,
            isVendor : true
        }
        return generateSignature(payload, globalObj.APP_SECRET || "")
    }

    async signUp(singnUpInputs : any ){

        const existingUser = await this.vendorRepo.findUserByEmail(singnUpInputs.email);
        if(existingUser) {
                throw new ValidationError("Email already exist");
        }
        return await this.vendorRepo.createNewUser(singnUpInputs)
    }


    async addProduct(productInfo : ProductInputs){
        const validProductInput = ProductInput.safeParse(productInfo);
        if(validProductInput.success === false){
            throw new ValidationError("Wrong Product Inputs")
        }
        return this.vendorRepo.addProduct(productInfo)
    }

    async bulkAdd(productInfo : any) {
        try {
            return this.vendorRepo.bulkAdd(productInfo)
        } catch (error) {
            throw error
        }
    }

    async productById(productId : string){
        try {
            return this.vendorRepo.productById(productId);
        } catch (error) {
            throw error;
        }
    }

    async product(page : number, limit : number, sort: boolean){
        return await this.vendorRepo.productInfo(page, limit , sort)
    }

    async pendingOrders( vendorId : string,page : number, limit : number){
        return await this.vendorRepo.pendingOrderDetails(vendorId,page, limit)
    }

    async subscribeEvents(payload : any) {
        payload = JSON.parse(payload)
        const { event, data } = payload;
        switch(event) {
            case "SEND_TO_VENDOR":
               return await this.vendorRepo.manageOrder(data)
            default:
                break;
        }
    }


}

export { VendorService }