import mongoose from 'mongoose';
import { logger } from '../utils/logger/logger.js';

async function dbconnection(){
    try{
        console.log("db connecting....");
        console.log("DB URL is ",process.env.DB_URL);
         await mongoose.connect(process.env.DB_URL);
        console.log("db connected");
    }
    catch(err){
        logger.error("DB connection error is...", {
            name : err.name,
            stack : err.stack,
            data : err.data
        })
    }
}

export { dbconnection }