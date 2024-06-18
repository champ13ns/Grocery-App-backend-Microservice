import express from 'express';
import router from './api/vendor-api';
import dotenv from 'dotenv'
import { dbconnection } from './database/connection';
import { errorMiddleware } from './api/middleware/errorMiddleware';
import { errorLogger } from './utils/errorLogger';
import { RPC_Observer } from './utils/rabbitMQ';

const app = express();
const PORT = 9004;

const startServer = async()=>{
    try {
        dotenv.config();
        console.clear()
        app.use(express.json())
       await dbconnection();
       await RPC_Observer();
       app.listen(9004, () => {
           console.log("Vendor microservice started on port ",PORT);
       })
       app.use(express.json())
       app.use('/vendor',router, errorMiddleware); 
    } catch (error : any ) {

        errorLogger.error("Error occured while starting the server......", {
            name : error.name,
            stack : error.stack,
            message : error.message | error.data
        })
        
        process.exit(1)
    }
    
   }

startServer();