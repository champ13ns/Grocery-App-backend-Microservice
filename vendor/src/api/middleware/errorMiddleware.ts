import { Request, Response, NextFunction, Errback, Express } from "express";
import { ValidationError, APIError, NotFoundError, AuthorizeError } from "../../utils/appError";
import { errorLogger } from "../../utils/errorLogger";
const errorMiddleware = (err: any, req : Request, res: Response, next : NextFunction) => {
        console.log("start of errro middlewarea....")
        let commonError = true;
        [AuthorizeError,APIError,NotFoundError,AuthorizeError].forEach((x) => {
            if(typeof x === err) commonError = false;
        })
        if(commonError) {
            const data = err.data || err.message;
            console.log("error data ",data)
            const statusCode = err.statusCode || 500;
            res.status(statusCode).json(data || "Internal Server Error")
        } else {
            errorLogger.error("Unhandeled error....", {
                message : err.message || err.data,
                statusCode : err.statusCode || 500,
                stack : err.stack
            })
            res.status(err.statusCode || 500).json(err.data || "Internal Server Error")
        }
}

export { errorMiddleware }