import jwt from 'jsonwebtoken' 
import { globalObj } from '../../utils/globals.js';
import { errorLogger } from '../../utils/logger.js';

export const verifySignature =  (req,res,next) => {
    try {
    const bearerToken = req.headers.authorization;
    if(!bearerToken) return res.json({mssg : "No token found"});
    const token = bearerToken.split(" ")[1];
    const decodeToken = jwt.verify(token,globalObj.APP_SECRET);
    console.log("decoded token is ",decodeToken)
    if(decodeToken.isVendor === true){
        req.vendorId = decodeToken.id;
        req.isVendor = true;
    } 
    else 
    req.userId = decodeToken.id;
     next();
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}
