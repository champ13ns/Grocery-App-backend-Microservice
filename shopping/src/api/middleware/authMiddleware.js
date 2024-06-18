import jwt from 'jsonwebtoken'
import {globalObj} from '../../utils/envVariables.js'

export const authMiddleware = (req,res,next) => {
    try{
        const bearer = req.headers?.authorization;
        if(!bearer) res.json({mssg : "Token not present"})
        const token = bearer.split(" ")[1]
        const decodedToken = jwt.verify(token, globalObj.APP_SECRET)
        req.userId = decodedToken.id;
        req.email = decodedToken.email;
        next();
    } catch(err){
        res.status(401).json(err.message || err.data || "JWT expired/ missing")
    }
}