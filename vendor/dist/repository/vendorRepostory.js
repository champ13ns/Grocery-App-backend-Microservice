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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRepository = void 0;
const vendor_1 = require("../database/models/vendor");
const pedingOrder_1 = require("../database/models/pedingOrder");
const index_1 = require("../utils/index");
const rabbitMQ_1 = require("../utils/rabbitMQ");
const index_2 = require("../utils/index");
const uuid_1 = require("uuid");
class VendorRepository {
    signIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingVendor = yield vendor_1.vendorModel.findOne({ email: email });
                if (!existingVendor) {
                    return {
                        mssg: "email doesn't exist",
                    };
                }
                if (!(0, index_2.validatePassword)(password, existingVendor.salt, existingVendor === null || existingVendor === void 0 ? void 0 : existingVendor.password))
                    return { mssg: "Password didn't match" };
                const token = {
                    email,
                    id: existingVendor._id,
                    isVendor: true,
                };
                return (0, index_2.generateSignature)(token, index_1.globalObj.APP_SECRET || "");
            }
            catch (error) {
                throw error;
            }
        });
    }
    signUp(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield (0, index_2.generateSalt)();
                const hashedPassword = yield (0, index_2.generatePassword)(userInputs.password, salt);
                const dbInputs = Object.assign(Object.assign({}, userInputs), { password: hashedPassword, salt });
                const newVendor = yield vendor_1.vendorModel.create(dbInputs);
                return newVendor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addProduct(productInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    type: "ADD_PRODUCT",
                    data: productInfo,
                };
                const res = yield (0, rabbitMQ_1.RPC_Request)("PRODUCT_RPC", payload, (0, uuid_1.v4)());
                return res;
            }
            catch (error) {
                throw error;
            }
        });
    }
    bulkAdd(productInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    type: "BULK_ADD",
                    data: productInfo,
                };
                return yield (0, rabbitMQ_1.RPC_Request)("PRODUCT_RPC", payload, (0, uuid_1.v4)());
            }
            catch (error) {
                throw error;
            }
        });
    }
    productById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, rabbitMQ_1.RPC_Request)("PRODUCT_RPC", { type: "PRODUCT_INFO_BY_ID", data: productId }, (0, uuid_1.v4)());
            }
            catch (error) {
                throw error;
            }
        });
    }
    productInfo(page, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("alsdfjlasjdf");
                return yield (0, rabbitMQ_1.RPC_Request)("PRODUCT_RPC", { type: "GET_PRODUCT", data: { page, limit, sort } }, (0, uuid_1.v4)());
            }
            catch (error) {
                throw error;
            }
        });
    }
    newOrderDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // order Details -> array -> store details of order in vendor DB.
                console.log("data ", data);
                const items = data.items;
                const customerId = data.customerId;
                const orderId = data.orderId;
                for (const item of items) {
                    const vendorId = item.vendorId;
                    console.log("vendorId ", vendorId);
                    const exisitingOrder = yield pedingOrder_1.recievedOrderModel.findOne({ vendorId: vendorId });
                    console.log("existing Order is ", exisitingOrder);
                    if (exisitingOrder === null) {
                        // create new Order
                        const newOrder = {
                            vendorId,
                            pendingOrders: [{
                                    orderId,
                                    customerId,
                                    items: [{
                                            productId: item._id,
                                            quantity: item.quantity
                                        }]
                                }]
                        };
                        const neworder = yield pedingOrder_1.recievedOrderModel.create(newOrder);
                        console.log("new Order is ", neworder);
                        return newOrder;
                    }
                    else {
                        // check if Order id has 
                        const existingOrder = exisitingOrder.pendingOrders.find(orders => orders.orderId === orderId);
                        if (existingOrder) {
                            //@ts-ignore
                            exisitingOrder.items.push({
                                productId: item._id,
                                quantity: item.quantity
                            });
                        }
                        else {
                            const newOrder = {
                                orderId,
                                customerId,
                                items: [{ productId: item._id, quantity: item.quantity }]
                            };
                            yield exisitingOrder.pendingOrders.push(newOrder);
                            const updateOrder = yield exisitingOrder.save();
                            return updateOrder;
                        }
                        // send email to customer, notifying order details are sent to vendor.
                    }
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    pendingOrderDetails(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield pedingOrder_1.recievedOrderModel.find({ vendorId });
        });
    }
}
exports.VendorRepository = VendorRepository;
