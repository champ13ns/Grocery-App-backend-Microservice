import express from 'express'
import { customerAPI } from './api/customer.js';
import { dbconnection } from './database/connection.js';
import { errorHandler } from './utils/error/erroHandler.js';
import { logger } from './utils/logger/logger.js';

const app = express();

const startServer = async (app) => {
    try {
        app.use(express.json())
        const PORT = process.env.PORT;
        await dbconnection();
        console.log(PORT)
        app.listen(PORT, ()=>{
            console.log("User service started on port ",PORT)
        }) 
        customerAPI(app)
        errorHandler(app)
    } catch (error) {
        logger.error("error starting user microservice...", {
            name : error.name,
            stack : error.stack,
            message : error.message || error.data
        })
    }
}

startServer(app);