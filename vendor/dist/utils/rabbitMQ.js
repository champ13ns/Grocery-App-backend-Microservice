"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPC_Observer = exports.RPC_Request = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const _1 = require(".");
const vendor_service_1 = require("../service/vendor-service");
let amqplibConnection;
function createChannel() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let channel;
            if (amqplibConnection === undefined) {
                amqplibConnection = yield amqplib_1.default.connect(_1.globalObj.RABBIT_MQ_URL || "");
            }
            channel = yield amqplibConnection.createChannel();
            return channel;
        }
        catch (error) {
            throw error;
        }
    });
}
// payload -> 
// type : "ADD_PRODUCT", data : ""
// order placed -> queue -> message recvd -> add that order to vendor db
function RPC_Request(RPC_Queue, payload, uuid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("started. RPC");
            const channel = yield createChannel();
            const { queue } = yield channel.assertQueue("", { exclusive: true });
            yield channel.assertExchange(_1.globalObj.EXCHANGE_NAME || "", "direct");
            channel.sendToQueue(RPC_Queue, Buffer.from(JSON.stringify(payload)), {
                replyTo: queue,
                correlationId: uuid
            });
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject("API request cannot be resolved");
                }, 4000);
                channel.consume(queue, (message) => {
                    clearTimeout(timeout);
                    resolve(JSON.parse((message === null || message === void 0 ? void 0 : message.content.toString()) || ""));
                }, { noAck: true });
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.RPC_Request = RPC_Request;
function RPC_Observer() {
    return __awaiter(this, void 0, void 0, function* () {
        // 
        try {
            const channel = yield createChannel();
            yield channel.assertQueue("VENDOR_RPC", { exclusive: true });
            yield channel.consume("VENDOR_RPC", (message) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (message) {
                    channel.prefetch(1);
                    const recvdMessage = JSON.parse((_a = message.content) === null || _a === void 0 ? void 0 : _a.toString());
                    console.log("mssg recieved in VENDOR_RPC is...", recvdMessage);
                    const res = yield new vendor_service_1.VendorService().subscribeEvents(recvdMessage);
                    console.log("resposne is ", res);
                    channel.sendToQueue(message.properties.replyTo || "", Buffer.from(JSON.stringify(res)));
                }
            }));
        }
        catch (error) {
            throw error;
        }
    });
}
exports.RPC_Observer = RPC_Observer;
