import amqplib, { connect } from 'amqplib'
import { globalObj } from '../config/index.js';
import { v4 as randomId } from 'uuid'
import { logger } from './logger/logger.js';
let amqplibConnection = null;

export const createChannel = async () => {
  try {
    if (amqplibConnection === null) {
      console.log("Connecting to RabbitMQ...");
      amqplibConnection = await connect(globalObj.RABBIT_MQ_URL);
      console.log("Connected to RabbitMQ");
  }
  console.log("Creating channel...");
  const channel = await amqplibConnection.createChannel();
  return channel;
  } 
  catch (error) {
      logger.error("rabbit MQ Error...", {
        name : error.name,
        data : error.data,
        stack : error.stack
      })
  }
    
};


const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
  try {
    
 
    const channel = await createChannel();
    const q = await channel.assertQueue("", { exclusive: true });
    channel.sendToQueue(
      RPC_QUEUE_NAME,
      Buffer.from(JSON.stringify(requestPayload)),
      { replyTo: q.queue, correlationId: uuid }
    );
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        channel.close();
        resolve("API request could not be fulfilled");
      }, 2000);
      channel.consume(q.queue, (msg) => {
        if (msg.properties.correlationId === uuid) {
          resolve(JSON.parse(msg.content.toString()));
          clearTimeout(timeout);
        } else {
          reject("data not found");
        }
      });
    });
  } catch (error) {
    logger.error("rabbit MQ Error...", {
      name : error.name,
      data : error.data,
      stack : error.stack
    })
  }
  };

export const RPC_Request = async(RPC_QUEUE_NAME, requestPayload) => {
  try {
    const uuid = randomId();
    return await requestData(RPC_QUEUE_NAME, requestPayload, uuid)
  } catch (error) {
    logger.error("rabbit MQ Error...", {
      name : error.name,
      data : error.data,
      stack : error.stack
    })
  }
   
}