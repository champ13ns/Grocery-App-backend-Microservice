import mongoose from 'mongoose'
import { globalObj } from '../utils/globals.js';
import { errorLogger } from '../utils/logger.js';
const dbConnection = async()=>{
    try{
        await mongoose.connect(globalObj.DB_URL)
        console.log("DB Connected")
    }  catch(err){
        errorLogger.error("DB connection error...", {
            stack : err.stack,
            name : err.name,
            statusCode : err.statusCode
        })
        process.exit(1)
    }
}

export {dbConnection};