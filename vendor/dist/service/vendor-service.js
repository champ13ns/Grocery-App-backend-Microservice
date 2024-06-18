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
exports.VendorService = void 0;
const vendorRepostory_1 = require("../repository/vendorRepostory");
const index_1 = require("../utils/index");
class VendorService {
    constructor() {
        this.vendorRepo = new vendorRepostory_1.VendorRepository();
    }
    signIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inputRes = index_1.VendorLoginInput.safeParse({ email, password });
                if (inputRes.success == false) {
                    return inputRes.error;
                }
                return yield this.vendorRepo.signIn(email, password);
            }
            catch (error) {
                throw error;
            }
        });
    }
    signUp(singnUpInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const correctInputs = index_1.VendorSignUpInput.safeParse(singnUpInputs);
                if (correctInputs.success === false) {
                    return correctInputs.error;
                }
                return yield this.vendorRepo.signUp(singnUpInputs);
            }
            catch (error) {
                throw error;
            }
        });
    }
    //xuzwrycxvifksxtc
    addProduct(productInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validProductInput = index_1.ProductInput.safeParse(productInfo);
                if (validProductInput.success === false) {
                    return validProductInput.error;
                }
                return this.vendorRepo.addProduct(productInfo);
            }
            catch (error) {
                throw error;
            }
        });
    }
    bulkAdd(productInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.vendorRepo.bulkAdd(productInfo);
            }
            catch (error) {
                throw error;
            }
        });
    }
    productById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.vendorRepo.productById(productId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    product(page, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.vendorRepo.productInfo(page, limit, sort);
        });
    }
    pendingOrders(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderDetails = yield this.vendorRepo.pendingOrderDetails(vendorId);
                return orderDetails;
                ;
            }
            catch (error) {
                throw error;
            }
        });
    }
    subscribeEvents(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            payload = JSON.parse(payload);
            const { event, data } = payload;
            console.log("servie layer...", event, data);
            switch (event) {
                case "SEND_TO_VENDOR":
                    return yield this.vendorRepo.newOrderDetails(data);
                default:
                    break;
            }
        });
    }
}
exports.VendorService = VendorService;
