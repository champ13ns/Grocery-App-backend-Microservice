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
const vendor_api_1 = __importDefault(require("./api/vendor-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = require("./database/connection");
const app = (0, express_1.default)();
const PORT = 9004;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    app.use(express_1.default.json());
    (0, connection_1.dbconnection)();
    app.listen(9004, () => {
        console.log("Vendor microservie started on port ", PORT);
    });
    app.use(express_1.default.json());
    app.use('/vendor', vendor_api_1.default);
});
startServer();
