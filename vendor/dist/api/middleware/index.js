"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const utils_1 = require("../../utils");
const utils_2 = require("../../utils");
function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token)
            return { mssg: "Token not found" };
        const bearerToken = token.split(" ")[1];
        const validToken = (0, utils_1.verifySignature)(bearerToken, utils_2.globalObj.APP_SECRET || "");
        /// @ts-ignore
        if ((validToken === null || validToken === void 0 ? void 0 : validToken.isVendor) === true) {
            req.isVendor = true;
            // @ts-ignore
            req.vendorId = validToken === null || validToken === void 0 ? void 0 : validToken.id;
            console.log(req.isVendor, req.vendorId);
            next();
        }
        else {
            res.json({ mssg: "Route accessible for vendors only / invalid Token" });
        }
    }
    catch (error) {
        throw error;
    }
}
exports.authMiddleware = authMiddleware;
