const statusCode = {
    OK : 200,
    BAD_REQUEST : 400,
    UN_AUTHORISED : 403,
    NOT_FOUND : 404,
    INTERNAL_ERROR : 500
}
class BaseError extends Error {
    statusCode;
    constructor(name : string, statusCode : number, descirption : string) {
        super(descirption);
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = name;
        this.statusCode = statusCode
        Error.captureStackTrace(this)
    }
}

class ValidationError extends BaseError {
    constructor(desciption = "Validation Error"){
        super("validation error", 400, desciption)
    }
}

class NotFoundError extends BaseError {
    constructor(description = "Not Found error") {
        super("Not found",statusCode.NOT_FOUND,description)
    }
}


class AuthorizeError extends BaseError {
    constructor(description = "Authorize error") {
        super("Not authorized!!",statusCode.NOT_FOUND,description)
    }
}

class APIError extends BaseError {
    constructor(description = "api error") {
        super("api internal server error",statusCode.INTERNAL_ERROR,description);
    }
}


export { ValidationError, NotFoundError, AuthorizeError, APIError }
