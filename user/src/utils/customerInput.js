import { z } from 'zod'

const loginInputs = z.object({
    email : z.string().email({message : "Please Enter a valid email"}),
    password : z.string({message : "Please Enter a valid password"}),
})

const signUpInputs = z.object({
    email : z.string().email({message : "Please Enter a valid email"}),
    password : z.string().min(6,{message : "Please Enter a valid password"}),
    firstName : z.string({message : "Frist Name must be a string"}),
    lastName : z.string({message : "Last Name must be a string"}),
    lastName : z.string({message : "Phone number must be a string"}),
})

const addressInputs = z.object({
    street : z.string({message : "Phone number must be a string"}),
    pinCode : z.string({message : "Phone number must be a string"}),
    city : z.string({message : "Phone number must be a string"}),
    houseNumber : z.string({message : "Phone number must be a string"}),
})

export { loginInputs, signUpInputs, addressInputs }