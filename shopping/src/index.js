import express from 'express'
import { globalObj } from './utils/envVariables.js';
import dotenv from 'dotenv'
import { dbConnection } from './models/database/connection.js'
import { ShoppingApi } from './api/shoppingAPI.js';
import { createChannel, channel } from './utils/rabbitMQ.js';
import { errorMiddleware } from './api/middleware/errorMiddleware.js';
import { errorLogger } from './utils/error/errorLogger.js';
dotenv.config()
const startServer = async () => {
    try {
    const app = express();
    dotenv.config();
    app.use(express.json())
    await dbConnection();
    app.listen(globalObj.PORT , () => {
        console.log("Shopping service started at port ",globalObj.PORT)
    })
    if(channel === null)
    await createChannel();
    ShoppingApi(app, channel)
    errorMiddleware(app)
    } catch (error) {
        errorLogger.error("Error while starting shopping service...", 
            {
                data : error.data || error.message,
                stack : error.stack,
                statusCode : error.statusCode || 500
            }
        )
    }
    
}

startServer();
export { startServer }