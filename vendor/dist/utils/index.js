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
exports.verifySignature = exports.generateSignature = exports.validatePassword = exports.generatePassword = exports.generateSalt = exports.globalObj = exports.queryInput = exports.ProductInput = exports.VendorSignUpInput = exports.VendorLoginInput = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
exports.VendorLoginInput = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid emiail address" }),
    password: zod_1.z.string().min(6, { message: "Password must be atleast 6 charcaters long" })
});
exports.VendorSignUpInput = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid Email address" }),
    password: zod_1.z.string().min(8, { message: "Password must be atleast 8 chars long" }),
    firstName: zod_1.z.string({ message: "firstname must be a string" }),
    lastName: zod_1.z.string({ message: "firstname must be a string" }),
    description: zod_1.z.string().max(200, { message: 'Description can be atmax 200 chars long' }),
    storeName: zod_1.z.string({ message: "storeName must be a string" }),
    contactNumber: zod_1.z.string().length(10, { message: "contact Number must be of 10 digits" }),
});
exports.ProductInput = zod_1.z.object({
    name: zod_1.z.string({ message: "Name should be of type string only" }),
    category: zod_1.z.string({ message: "Type should be of type string only" }),
    price: zod_1.z.number({ message: "Price should be of type Number only" }),
    description: zod_1.z.string({ message: "Desc should be of type string only" }),
    availableUnit: zod_1.z.number({ message: "availableUnit should be of type Number only" }),
    brand: zod_1.z.string({ message: "Brand should be of type string only" }),
    available: zod_1.z.boolean({ message: "Can only be boolean" }),
});
exports.queryInput = zod_1.z.object({
    page: zod_1.z.number({ message: "page paramter in query can be number only" }),
    limit: zod_1.z.number({ message: "limit paramter in query can be number only" }),
    sort: zod_1.z.boolean({ message: "sort param can be boolean only" })
});
exports.globalObj = {
    DB_URL: process.env.DB_URL,
    APP_SECRET: process.env.APP_SECRET,
    RABBIT_MQ_URL: process.env.RABBIT_MQ_URL,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
};
function generateSalt() {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt();
        return salt;
    });
}
exports.generateSalt = generateSalt;
function generatePassword(password, salt) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPass = yield bcrypt_1.default.hash(password, salt);
        return hashedPass;
    });
}
exports.generatePassword = generatePassword;
function validatePassword(enteredPass, salt, savedPass) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPass = yield generatePassword(enteredPass, salt);
        return hashedPass === savedPass;
    });
}
exports.validatePassword = validatePassword;
function generateSignature(payload, secret) {
    console.log(payload, secret);
    const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '30d' });
    console.log("token....", token);
    return token;
}
exports.generateSignature = generateSignature;
function verifySignature(token, secret) {
    return jsonwebtoken_1.default.verify(token, secret);
}
exports.verifySignature = verifySignature;
