import CustomerRepository from "../repository/customerRepository.js";
import { ValidationError, NotFoundError } from "../utils/error/appError.js";
import { generateSalt, generateSignature, generatePassword, validatePassword } from "../utils/index.js";
import { RPC_Request } from "../utils/rabbitMQ.js";
class CustomerService{
    constructor(){
        this.customerRepo = new CustomerRepository();
    }

    async SignIn(userInputs){
            const { email, password } = userInputs;
            
            const existingCustomer = await this.customerRepo.FindCustomer({email});
            if(!existingCustomer) {
                throw new NotFoundError("Email doesn't exist");
            }
            
            const correctPass = await validatePassword(password, existingCustomer.salt, existingCustomer.password);
            if(!correctPass) throw new ValidationError("Wrong password entered");
            const payload = {
                id : existingCustomer._id,
                email,
                isVendor : false
            }
            const signautre = generateSignature(payload,process.env.APP_SECRET)
            return { id : existingCustomer._id, signautre }
      
    }

    async SignUp({ email, password, firstName, lastName, phone }){
        
        const existingCustomer = await this.customerRepo.FindCustomer({email})
        if(existingCustomer) {
            throw new  ValidationError("Customer with this email alrady exist")
        }
        let salt = await generateSalt();
        let hashedPass = await generatePassword(password, salt);
        const newUser = await this.customerRepo.CreateCustomer({email,password : hashedPass,phone,salt, firstName, lastName})
        return newUser
    }

    async AddAddress(userInput,userId){
        const { street, pinCode, city, houseNumber } = userInput;
        const validUserId = await this.customerRepo.FindCustomerById({id : userId})
        if(!validUserId) throw new NotFoundError("Not Valid Customer Id");
        const newAddress = await this.customerRepo.CreateAddress({_id : userId, street, pinCode, city, houseNumber});
        return newAddress
    }

    async GetProfile(userId) {
        const validUserId = this.customerRepo.FindCustomerById({id : userId})
        if(!validUserId) throw new NotFoundError("Not Valid Customer Id");
        return await this.customerRepo.FindCustomerById({id : userId})
    }

    async DeleteUser(userId){
        const validUserId = await this.customerRepo.FindCustomerById({id : userId})
        console.log("customer Id details are ",validUserId);
        if(validUserId === null) throw new NotFoundError("Not Valid Customer Id");
        const payload = { event : "DELETE_CUSTOMER_INFO", data : userId }
        const deletedData = await RPC_Request("SHOPPING_RPC",JSON.stringify(payload))
        const del = await this.customerRepo.DeleteCustomerById({id : userId});
        return { del, deletedData }
    }
   
}

export { CustomerService }