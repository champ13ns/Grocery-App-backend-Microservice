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
const express_1 = __importDefault(require("express"));
const vendor_service_1 = require("../service/vendor-service");
const middleware_1 = require("./middleware");
const utils_1 = require("../utils");
const rabbitMQ_1 = require("../utils/rabbitMQ");
const router = express_1.default.Router();
const vendorService = new vendor_service_1.VendorService();
(0, rabbitMQ_1.RPC_Observer)();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        return res.json(yield vendorService.signIn(email, password));
    }
    catch (error) {
        throw error;
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield vendorService.signUp({ email: req.body }));
    }
    catch (error) {
        throw error;
    }
}));
// router.get('/product/:id' , authMiddleware, async(req : Request, res:Response, next: NextFunction) => {
//     try {
//     } catch (error) {
//         throw error;
//     }
// })
router.post('/product', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield vendorService.addProduct(req.body));
    }
    catch (error) {
        throw error;
    }
}));
router.get('/product', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        let page = (((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) === undefined) ? 1 : (typeof req.query.page === 'string') ? parseInt(req.query.page) : req.query.page;
        let limit = (((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) === undefined) ? 10 : (typeof req.query.limit === 'string') ? parseInt(req.query.limit) : req.query.limit;
        let sort = (((_c = req.query) === null || _c === void 0 ? void 0 : _c.sort) === undefined) ? false : (req.query.sort === 'true') ? true : false;
        const inputRes = utils_1.queryInput.safeParse({ page, limit, sort });
        console.log(inputRes);
        if (inputRes.success === false)
            return res.json(inputRes.error);
        res.json(yield vendorService.product(((_d = inputRes.data) === null || _d === void 0 ? void 0 : _d.page) || 1, ((_e = inputRes.data) === null || _e === void 0 ? void 0 : _e.limit) || 10, ((_f = inputRes.data) === null || _f === void 0 ? void 0 : _f.sort) || false));
    }
    catch (error) {
        throw error;
    }
}));
router.post('/bulkadd', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newProductInfo = [];
        let prodInfo = req.body;
        prodInfo.map((prod) => {
            // @ts-ignore
            newProductInfo.push(Object.assign(Object.assign({}, prod), { vendorId: req.vendorId }));
        });
        res.json(yield vendorService.bulkAdd(newProductInfo));
    }
    catch (error) {
        throw error;
    }
}));
router.get('/order', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // return all the pending order for vendor
        return yield vendorService.pendingOrders(req.vendorId || "");
    }
    catch (error) {
        throw error;
    }
}));
exports.default = router;
