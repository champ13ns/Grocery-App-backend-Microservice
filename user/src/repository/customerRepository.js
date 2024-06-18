import { customer } from "../database/models/Customer.js";
import { address } from '../database/models/Address.js'
import { logger } from "../utils/logger/logger.js";

class CustomerRepository {

  async FindCustomer({ email }){
    return await customer.findOne({ email })
  }

  async FindCustomerById({ id }){
    try {
      const user =  await customer.findById({_id : id}).populate("address")
      console.log("user is ",user)
      return user  
    } catch (error) {
      logger.error("Repository layer error...", {
        name : error.name,
        message : error.message,
        stack : error.stack,
        data : error.data
      })
    }
    
  }

  async DeleteCustomerById({ id }){
    try{
      
      return await customer.findByIdAndDelete({_id : id})
    }
    catch (error) {
      logger.error("Repository layer error...", {
        name : error.name,
        message : error.message,
        stack : error.stack,
        data : error.data
      })
  }
}

  async CreateCustomer({email, password, phone , salt, firstName, lastName}){
    try {
      const newCustomer = await customer.create({
        email,
        firstName,
        lastName,
        password,
        phone,
        salt, 
        address : []
      })
      return newCustomer;  
    } catch (error) {
      logger.error("Repository layer error...", {
        name : error.name,
        message : error.message,
        stack : error.stack,
        data : error.data
      })
    }
    
  }

  async CreateAddress({_id, street, pinCode, city , houseNumber }){
    try {
      const existingUser = await customer.findById({_id});
      if(existingUser) {
        const newAddress = await address.create({
          street,
          pinCode,
          city,
          houseNumber
        })
        await newAddress.save();
        existingUser.address.push(newAddress)
        return await existingUser.save();
      }
      return {}
    } catch (error) {
      logger.error("Repository layer error...", {
        name : error.name,
        message : error.message,
        stack : error.stack,
        data : error.data
      })
    }
   
  }

}

export default CustomerRepository;