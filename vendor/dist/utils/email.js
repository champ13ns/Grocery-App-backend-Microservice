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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create a transporter object using the default SMTP transport
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'sachinfuloria9@gmail.com',
        pass: 'xuzwrycxvifksxtc'
    }
});
const orderDetails = {
    _id: '66657dce336fad41551a2f0f',
    orderId: 'f1497376-4666-41b2-8f16-9a896780db40',
    customerId: '665a941044816ee7f7af1158',
    amount: 2999.9,
    status: 'received',
    items: [
        {
            _id: '66618dcbf9a8eac60d765d25',
            vendorId: '66604ec8e2aa5f836a52a67c',
            name: 'Standing Desk',
            description: 'Height adjustable standing desk with programmable settings.',
            price: 299.99,
            quantity: 10
        }
    ],
    __v: 0
};
const generateOrderEmailHTML = (order) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 0;
            text-align: center;
        }
        .order-details {
            margin: 20px 0;
        }
        .order-details th, .order-details td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #dddddd;
        }
        .order-details th {
            background-color: #f4f4f4;
        }
        .total {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
        }
        .status {
            color: #28a745;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
        </div>
        <p>Hello,</p>
        <p>Thank you for your order. Here are your order details:</p>
        <div class="order-details">
            <table width="100%">
                <tr>
                    <th>Order ID</th>
                    <td>${order.orderId}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td class="status">${order.status}</td>
                </tr>
                <tr>
                    <th>Amount</th>
                    <td>$${order.amount.toFixed(2)}</td>
                </tr>
            </table>
            <h3>Items</h3>
            <table width="100%">
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>
                ${order.items.map((item) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                </tr>`).join('')}
            </table>
            <p class="total">Total: $${order.amount.toFixed(2)}</p>
        </div>
        <p>We hope you enjoy your purchase. If you have any questions, feel free to contact us.</p>
        <p>Best regards,</p>
        <p>Sachin's Mart</p>
    </div>
</body>
</html>
`;
function sendMail() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const html = generateOrderEmailHTML(orderDetails);
            const info = yield transporter.sendMail({
                from: 'your-email@gmail.com',
                to: "sachinfuloria7@gmail.com, sachinfuloria4@gmail.com",
                subject: "Your Order Details",
                html // html body
            });
            console.log("Message sent: %s", info.messageId);
        }
        catch (error) {
            console.error("Error sending email: ", error);
        }
    });
}
exports.sendMail = sendMail;
sendMail();
