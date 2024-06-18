import { CustomerService } from "../services/customer-service.js"
import { authMiddleware } from "./middleware/authMiddleware.js"
import { loginInputs, signUpInputs, addressInputs } from "../utils/customerInput.js"
import { z } from 'zod'
const customerAPI = (app)=>{

    const service = new CustomerService()
    // subscribeMessage(channel, service);
    app.post('/login' ,async (req,res,next) => {
            try {
            const validLoginInputs = loginInputs.safeParse(req.body);
            if(validLoginInputs.error === true){
               return res.status(403).json(validLoginInputs)
            }
            const user = await service.SignIn(req.body)
            res.json(user)
        } catch (error) {
            next(error)
        }
    })

    app.post('/signup' ,async (req,res,next) => {
        try 
        {
            const validSignUpInputs = signUpInputs.safeParse(req.body);
            if(validSignUpInputs.error === true){
               return res.status(403).json(validSignUpInputs)
            }
            const user = await service.SignUp(req.body);
            res.json(user)
        }
            
        catch (error) {
            next(error)
        }
    })

    app.use(authMiddleware)

    app.post('/addAddress' ,async (req,res,next) => {
        try {
            const validaddressInputs = addressInputs.safeParse(req.body);
            if(validaddressInputs.error === true){
               return res.status(403).json(validaddressInputs)
            }
            const user = await service.AddAddress(req.body, req.userId)
            res.json(user)
        } catch (error) {
            next(error)
        }
        
    })
    app.delete('/user', async(req,res,next) => {
        // 
        try {
            const userId = req?.userId;
        if(!userId) {
            res.json({
                "message" : "User Not Logged In"
            })
        }
        const resDetails = await service.DeleteUser(req.userId);
        res.json(resDetails)
        } catch (error) {
            next(error)   
        }
        
    })
}

export { customerAPI }