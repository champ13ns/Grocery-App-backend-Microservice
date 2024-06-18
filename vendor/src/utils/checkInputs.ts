import { z } from "zod"; 
export interface loginInputs  z.object({
    email : z.string().email({message : "Enteer valid email address"}),
    password : z.string().min(8 , {message : "min 8 chars password needed"})
})

export interface signUpInputs {
    
}
    