import amqplib, { Connection, Channel } from 'amqplib'
import { globalObj } from '.';
import { VendorService } from '../service/vendor-service';

let amqplibConnection : Connection;

async function createChannel(){
        let channel : Channel;
        if(amqplibConnection === undefined){
            amqplibConnection = await amqplib.connect(globalObj.RABBIT_MQ_URL || "");
        }
        channel = await amqplibConnection.createChannel();
        console.log("rabbitMQ Channel created");
        return channel;
   
}
// payload -> 
// type : "ADD_PRODUCT", data : ""

// order placed -> queue -> message recvd -> add that order to vendor db 

export async function RPC_Request(RPC_Queue : string, payload  : any, uuid : string){
        console.log("started. RPC")
        const channel = await createChannel();
        const  { queue } = await channel.assertQueue("", { exclusive : true })
        
        await channel.assertExchange(globalObj.EXCHANGE_NAME || "" , "direct")
         channel.sendToQueue(RPC_Queue,Buffer.from(JSON.stringify(payload)),{
            replyTo : queue,
            correlationId : uuid
        })

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject("API request cannot be resolved")
            }, 4000)
            channel.consume(queue , (message) => {
                clearTimeout(timeout)
                resolve(JSON.parse(message?.content.toString() || ""))
            },  { noAck : true })
        })
    
}

async function RPC_Observer(){
    
        const channel = await createChannel();
        await channel.assertQueue("VENDOR_RPC", { exclusive : true});
        await channel.consume("VENDOR_RPC"  , async(message) => {
            if(message) {
                channel.prefetch(1)
                const recvdMessage = JSON.parse(message.content?.toString());
                console.log("mssg recieved in VENDOR_RPC is...",recvdMessage);
                const res = await new VendorService().subscribeEvents(recvdMessage);
                console.log("resposne is ",res)
                channel.sendToQueue(message.properties.replyTo || "" , Buffer.from(JSON.stringify(res)), {correlationId : message.properties.correlationId});
            }
        })
        
   
}

export { RPC_Observer}