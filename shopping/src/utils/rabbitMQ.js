import { v4 as randomId } from 'uuid'
import { connect } from 'amqplib';
import { globalObj } from './envVariables.js'

let amqplibConnection = null;
export let channel = null;

const createChannel = async() => {
    if(amqplibConnection === null){
        amqplibConnection = await connect(globalObj.RABBIT_MQ_URL)
    }
    if(channel === null)
    channel = await amqplibConnection.createChannel(); 
    return channel;
}


const subscribeMessage = async(channel, service) => {
    await channel.assertExchange(globalObj.EXCHANGE_NAME,"direct", { durable : true });
    const q = await channel.assertQueue("", { exclusive : true });
    channel.bindQueue(q.queue,globalObj.EXCHANGE_NAME,globalObj.SHOPPING_SERVICE);
    channel.consume(q.queue, (message) => {
        console.log("mssg recvd in Shopping service is ",JSON.parse(message.content.toString()));
        if(message.content){
            service.SubscribeEvents(JSON.parse(message.content.toString()));
        }
    }, {
        noAck : true
    })
}



export const RPCObserver = async (RPC_QUEUE_NAME, service, channel) => {
   const q =  await channel.assertQueue(RPC_QUEUE_NAME, { durable: false });
    channel.consume(RPC_QUEUE_NAME, async (msg) => {    
        
        const payload = JSON.parse(msg.content.toString());
        const res = await service.SubscribeEvents(payload);
        console.log(msg.properties)
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(res)), {
            correlationId: msg.properties.correlationId
        });
    });
};


const requestData = async(RPC_QUEUE_NAME, channel, requestPayload, uuid) => {
    const q = await channel.assertQueue("" , { exclusive : true });
    channel.sendToQueue(RPC_QUEUE_NAME , Buffer.from(JSON.stringify(requestPayload)), {
        replyTo : q.queue,
        correlationId : uuid
    })
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            channel.close();
            resolve("API request could not be fulfilled")
        }, 8000)
        channel.consume(q.queue, (msg) => {
            if(msg.properties.correlationId === uuid){
                console.log("mssg is ",JSON.parse(msg.content.toString()))
                resolve (JSON.parse(msg.content.toString()));    
                clearTimeout(timeout);
            } else {
                reject("data not found")
            }
        })
    })

}


const RPC_Request = async(RPC_QUEUE_NAME,channel,requestPayload) => {
    const uuid = randomId();
    return await requestData(RPC_QUEUE_NAME,channel,requestPayload,uuid)
}

export { subscribeMessage, RPC_Request, createChannel }