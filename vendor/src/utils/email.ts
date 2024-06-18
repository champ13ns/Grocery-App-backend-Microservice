import nodemailer from 'nodemailer';
import { globalObj } from '.';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${globalObj.EMAIL}`,
        pass: `${globalObj.PASSWORD}`
    }
});

const generateOrderEmailHTML = (order : any) => `
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
                ${order.items.map((item: { name: any; description: any; price: number; quantity: any; })  => `
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

async function sendMail(senderEmail :any,  orderDetails : any) {

    try {
        console.log(senderEmail, orderDetails);
        
        const html = generateOrderEmailHTML(orderDetails);
        const info = await transporter.sendMail({
            from: `${globalObj.EMAIL}`, 
            to: `${senderEmail}`, 
            subject: "Your Order Details", 
            html
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
}


export { sendMail };
