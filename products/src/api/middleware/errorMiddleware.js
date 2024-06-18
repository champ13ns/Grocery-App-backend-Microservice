import { errorLogger } from "../../utils/logger.js";
import { APIError, AuthorizeError,ValidationError, NotFoundError  } from "../../utils/appError.js";
const errorMiddleware = (app) => {
  // skip common errors, only write 500 error in logger file
  console.log("start of error middlware ....")
  app.use((err, req,res,next) => {
    console.log("err middlware ....");
    let commonError = true;
    [APIError, AuthorizeError, NotFoundError, ValidationError].forEach((typeofError) => {
      if(err instanceof typeofError) commonError = false;
    })

    if (commonError) {
      console.log("inside common error");
      errorLogger.log("Unhandled Error ....", {
        name: err.name,
        message: err.message || err.data,
        stack: err.stack,
        statusCode: err.statusCode,
      });
      const statusCode = err.statusCode || 500;
      const data = err.data || err.messsage;
      res.status(statusCode).json(data);
    } else {
    const data = err.data || err.message;
    const statusCode = err.statusCode || 500;
    console.log("error details");
    console.log(data);
    console.log(statusCode)
    res.status(statusCode).json(data)
 } })
};

export { errorMiddleware }