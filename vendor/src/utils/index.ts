import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose';
import dotenv from 'dotenv'
import { z } from 'zod';

dotenv.config();

interface payload {
    email : string,
    id : string | Types.ObjectId ,
    isVendor : boolean
}

export const VendorLoginInput = z.object({
    email : z.string().email({message : "Invalid emiail address"}),
    password : z.string().min(6 , {message : "Password must be atleast 6 charcaters long"})
})

export const VendorSignUpInput = z.object({
    email : z.string().email({message : "Invalid Email address"}),
    password : z.string().min(8, {message : "Password must be atleast 8 chars long"}),
    firstName : z.string({message : "firstname must be a string"}),
    lastName : z.string({message : "firstname must be a string"}),
    description : z.string().max(200, {message : 'Description can be atmax 200 chars long'}),
    storeName : z.string({message : "storeName must be a string"}),
    contactNumber: z.string().length(10, {message : "contact Number must be of 10 digits"}),
})

export const ProductInput = z.object({
    name : z.string({message : "Name should be of type string only"}),
    category : z.string({message : "Type should be of type string only"}),
    price : z.number({message : "Price should be of type Number only"}),
    description : z.string({message : "Desc should be of type string only"}),
    availableUnit : z.number({message : "availableUnit should be of type Number only"}),
    brand : z.string({message : "Brand should be of type string only"}),
    available : z.boolean({message : "Can only be boolean"}),

})

export const queryInput = z.object({
    page : z.number({message : "page paramter in query can be number only"}),
    limit : z.number({message : "limit paramter in query can be number only"}),
    sort : z.boolean({message : "sort param can be boolean only"})
})


export const globalObj = {
    DB_URL : process.env.DB_URL,
    APP_SECRET : process.env.APP_SECRET,
    RABBIT_MQ_URL : process.env.RABBIT_MQ_URL,
    EXCHANGE_NAME : process.env.EXCHANGE_NAME,
    EMAIL : process.env.EMAIL,
    PASSWORD : process.env.PASSWORD
}

export interface SignUpInputs{
    email : string,
    firstName : string,
    lastName : string,
    salt : string,
    isVendor : boolean,
    description : string,
    storeName : string,
    contactNumber : string,
    password : string
}

export interface ProductInputs{
    name : string,
    category : string,
    lastName : string,
    price : number,
    description : string,
    brand : string,
    available : boolean,
    vendorId : string,
    
}

export interface LoginInputs{
    email : string,
    password : string
}

export async function generateSalt(){
  const salt =  await bcrypt.genSalt();
  return salt;
}

export async function generatePassword(password : string,salt: string){
    const hashedPass = await bcrypt.hash(password,salt);
    return hashedPass;
}

export async function validatePassword( enteredPass : string, salt : string , savedPass : string ){
    const hashedPass = await generatePassword(enteredPass, salt);
    return hashedPass === savedPass;
}

export function generateSignature(payload : payload ,secret : string){
    console.log(payload, secret);
    const token = jwt.sign(payload,secret , { expiresIn : '30d' })
    
    return token
}

export function verifySignature(token : string,secret : string){
    return jwt.verify(token , secret);
}

