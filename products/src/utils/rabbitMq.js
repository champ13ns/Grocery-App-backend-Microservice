import { connect } from "amqplib";
import { globalObj } from "./globals.js";  
import { errorLogger } from "./logger.js";
let amqplibConnection = null;

const createChannel = async () => {
  try {
    let channel;
    if (amqplibConnection === null) {
      amqplibConnection = await connect(globalObj.RABBIT_MQ_URL);
    }
    channel = await amqplibConnection.createChannel();
    await channel.assertQueue(globalObj.EXCHANGE_NAME, "", { durable: true }); // Exchange Name
    return channel;
  } catch (error) {
    errorLogger.log("Rabbit MQ error...", {
      data : error.dat || error.message,
      stack : error.stack,
      statusCode : error.statusCode || 500
    })
  }
 
};

const publishMessage = async (channelName, service, message) => {
  try {
    channelName.publish(globalObj.EXCHANGE_NAME, service, Buffer.from(message));
    console.log("Sent message ");
  } catch (error) {
    errorLogger.log("Rabbit MQ error...", {
      data : error.dat || error.message,
      stack : error.stack,
      statusCode : error.statusCode || 500
    })
  }

};

export const RPCObserver = async (RPC_QUEUE_NAME, service) => {
  let channel;
  if (amqplibConnection === null) {
    amqplibConnection = await connect(globalObj.RABBIT_MQ_URL);
  }
  if (!channel) channel = await amqplibConnection.createChannel();
  await channel.assertQueue(RPC_QUEUE_NAME, { durable: false });

  channel.consume(RPC_QUEUE_NAME, async (msg) => {
    try {
      const payload = JSON.parse(msg.content.toString());
      console.log("payload recvd in product service is ", payload);
      const res = await service.serveRPCRequest((payload));
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(res)),
        {
          correlationId : msg.properties.correlationId
        }
      );
      channel.ack(msg);
    } 
    catch (error) {
      console.log("erro details....",error)
      errorLogger.log("Rabbit MQ error...", {
        data : error.data || error.message,
        stack : error.stack,
        statusCode : error.statusCode || 500
      })
    }
  });
};

export { createChannel, publishMessage };
