import { AuthorizeError, APIError,ValidationError,NotFoundError } from "../../utils/error/appError.js";

export const errorMiddleware = (app) => {
    app.use((err, req,res,next) => {
        let commonError = true
        let arr =  [AuthorizeError, APIError, ValidationError, NotFoundError]
        arr.forEach((x) => {
            if(err instanceof x) commonError = false;
        })

        if(commonError) {
            const data = err.data || err.message;
            const statusCode = err.statusCode || 500;
            console.log("error data....",data);
            res.status(statusCode).json(data);
        } else {
            const data = err.data || err.message;
            const statusCode = err.statusCode || 500;
            console.log("error data....",data);
            res.status(statusCode).json(data);
        }
    })
}