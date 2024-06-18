import express from "express";
import { dbConnection } from "./database/connection.js";
import { productApi } from "./api/productApi.js";
import dotenv from "dotenv";
import { createChannel } from "./utils/rabbitMq.js";
import { globalObj } from "./utils/globals.js";
import { errorMiddleware } from "./api/middleware/errorMiddleware.js";

dotenv.config();

const startServer = async () => {
  try {
    const app = express();
    const port = globalObj.PORT;
    app.use(express.json());
    app.listen(port, () => {
      console.log("Products service started at port ", port);
    });
    await dbConnection();
    productApi(app);
    errorMiddleware(app);
  } catch (error) {
    next(error);
  }
};

startServer();
