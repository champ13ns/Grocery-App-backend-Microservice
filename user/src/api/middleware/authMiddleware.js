import { verifySignature } from "../../utils/index.js";
import { globalObj } from './../../config/index.js'
import { logger } from "../../utils/logger/logger.js";
import {  AuthorizeError } from "../../utils/error/appError.js";
export const authMiddleware =  (req,res,next) => {
    try {
        const bearerToken = req.headers.authorization;
        if(!bearerToken) res.json(new AuthorizeError("Token Missing"));
        const token = bearerToken.split(" ")[1];    
        const signRes =  verifySignature(token,globalObj.APP_SECRET);
        signRes?.isVendor ? req.isVendor = true  : req.isVendor = false;
        req.userId = signRes.id
        next();
    } catch (error) {
        logger.error("Error in middleware....", {
            name : error.name,
            message : error.message,
            stack : error.stack,
            data : error.data
        })
    }
   
}
