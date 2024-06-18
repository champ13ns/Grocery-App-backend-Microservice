import { APIError, ValidationError, AuthorizeError, NotFoundError } from "./appError.js";
import { logger } from "../logger/logger.js";
const errorHandler = (app) => {
    app.use((err,req,res,next) => {
        let commonError = true;
        [APIError, ValidationError, AuthorizeError, NotFoundError].forEach((typeofError) => {
            console.log(typeofError)
            if(err instanceof typeofError) commonError = false
        })

        if(commonError) {
            // write this error to winston logger
            logger.error("Unhandled error... ", {
                name : err.name,
                message : err.message,
                statusCode : err.statusCode || 500,
                stack : err.stack,
                data : err.data
            })
        }

        const statusCode = err.statusCode || 500;
        const data = err.data || err.message;
        res.status(statusCode).json(data)

    })
}

export { errorHandler }