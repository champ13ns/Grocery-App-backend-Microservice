import { Request, Response, NextFunction } from "express"
import { verifySignature } from "../../utils"
import { globalObj } from "../../utils";
import { JwtPayload } from "jsonwebtoken";
import { AuthorizeError } from "../../utils/appError";
interface validRequest extends Request {
    isVendor ?: boolean,
    vendorId ?: string
}
export const authMiddleware = async(req : validRequest, res : Response,next: NextFunction) => {
    try {
        const jwt = req.headers?.authorization;
        if(!jwt || jwt === undefined) throw new AuthorizeError("JWT Token not present")
        const token = jwt?.split(" ")[1];
        const decodedToken : JwtPayload | string =  verifySignature(token || "",globalObj.APP_SECRET || "");
        req.isVendor = true;
        //@ts-ignore
        req.vendorId = decodedToken.id
        next()
    } catch (error : any) {
        res.status(error.statusCode || 500).json(error.message || "Invalid jwt token/ token missing")
    }
}

export { validRequest }