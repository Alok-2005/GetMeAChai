// import { NextResponse } from "next/server";
// import connectDb from "@/app/db/connectDb";
// import Payment from "@/app/models/Payment";
// import Twilio from "twilio";
// import PDFDocument from "pdfkit";
// import { promises as fs } from "fs";
// import path from "path";

// // Initialize Twilio client
// const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// export const POST = async (req) => {
//     await connectDb();

//     try {
//         // Parse Twilio's form-data
//         const body = await req.formData();
//         const params = Object.fromEntries(body);
//         console.log("Twilio Webhook Body:", JSON.stringify(params, null, 2));

//         const from = params.From; // Sender's WhatsApp number
//         const message = params.Body; // Message content

//         // Parse Transaction ID
//         const transactionIdMatch = message.match(/Transaction ID: ([^\n]+)/);
//         if (!transactionIdMatch) {
//             console.error("No Transaction ID found in message:", message);
//             await twilioClient.messages.create({
//                 from: process.env.TWILIO_WHATSAPP_NUMBER,
//                 to: from,
//                 body: "Invalid message format. Please include the Transaction ID.",
//             });
//             return NextResponse.json({ success: false, message: "Invalid message format" });
//         }

//         const transactionId = transactionIdMatch[1].trim();
//         console.log("Extracted Transaction ID:", transactionId);

//         // Verify payment
//         const payment = await Payment.findOne({ transactionId, done: true });
//         if (!payment) {
//             console.error("Payment not found or not completed:", transactionId);
//             await twilioClient.messages.create({
//                 from: process.env.TWILIO_WHATSAPP_NUMBER,
//                 to: from,
//                 body: "Payment not found or not completed. Please check your Transaction ID.",
//             });
//             return NextResponse.json({ success: false, message: "Payment not found" });
//         }

//         console.log("Payment Found:", JSON.stringify(payment.toObject(), null, 2));

//         // Generate PDF
//         const doc = new PDFDocument();
//         const buffers = [];
//         doc.on("data", buffers.push.bind(buffers));

//         // Create PDF content
//         doc.fontSize(20).text("Payment Receipt", { align: "center" });
//         doc.moveDown();
//         doc.fontSize(12).text(`Name: ${payment.name || "Unknown"}`);
//         doc.text(`Amount: ₹${payment.amount || 0}`);
//         doc.text(`Message: ${payment.message || "No message"}`);
//         doc.text(`UPI ID: ${payment.upiId || "Not available"}`);
//         doc.text(`Transaction ID: ${payment.transactionId || "Not available"}`);
//         doc.text(`Razorpay Payment ID: ${payment.razorpayPaymentId || "Not available"}`);
//         doc.text(`Date: ${payment.updatedAt ? new Date(payment.updatedAt).toLocaleString() : "N/A"}`);
//         doc.text(`Recipient: ${payment.to_user}`);

//         // Save PDF locally
//         const publicDir = path.join(process.cwd(), "public", "receipts");
//         await fs.mkdir(publicDir, { recursive: true });
//         const fileName = `receipt-${transactionId}.pdf`;
//         const filePath = path.join(publicDir, fileName);

//         doc.pipe(require("fs").createWriteStream(filePath));
//         doc.end();

//         // Wait for PDF to be written
//         await new Promise((resolve) => doc.on("end", resolve));

//         console.log("PDF Generated:", filePath);

//         // Send PDF via Twilio
//         const pdfUrl = `${process.env.NEXT_PUBLIC_URL}/receipts/${fileName}`;
//         console.log("PDF URL:", pdfUrl);

//         await twilioClient.messages.create({
//             from: process.env.TWILIO_WHATSAPP_NUMBER,
//             to: from,
//             body: "Here is your payment receipt.",
//             mediaUrl: [pdfUrl],
//         });

//         console.log("PDF Sent to:", from);

//         return NextResponse.json({ success: true, message: "Receipt sent", pdfUrl });
//     } catch (error) {
//         console.error("Error in WhatsApp webhook:", error.message, error.stack);
//         try {
//             await twilioClient.messages.create({
//                 from: process.env.TWILIO_WHATSAPP_NUMBER,
//                 to: params.From || "whatsapp:+1234567890",
//                 body: "An error occurred. Please try again later.",
//             });
//         } catch (sendError) {
//             console.error("Error sending error message:", sendError.message);
//         }
//         return NextResponse.json({ success: false, message: "Server error", error: error.message });
//     }
// };






// app/api/whatsapp/verify/route.js
import { NextResponse } from "next/server";
import connectDb from "@/app/db/connectDb";
import Payment from "@/app/models/Payment";
import Twilio from "twilio";
import PDFDocument from "pdfkit";
import { promises as fs } from "fs";
import path from "path";

// Initialize Twilio client
const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req) {
    await connectDb();

    try {
        // Parse Twilio's form-data
        const body = await req.formData();
        const params = Object.fromEntries(body);
        console.log("Twilio Webhook Body:", JSON.stringify(params, null, 2));

        const from = params.From; // Sender's WhatsApp number
        const message = params.Body; // Message content

        // Parse Transaction ID
        const transactionIdMatch = message.match(/Transaction ID: ([^\n]+)/);
        if (!transactionIdMatch) {
            console.error("No Transaction ID found in message:", message);
            await twilioClient.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: from,
                body: "Invalid message format. Please include the Transaction ID.",
            });
            return NextResponse.json({ success: false, message: "Invalid message format" });
        }

        const transactionId = transactionIdMatch[1].trim();
        console.log("Extracted Transaction ID:", transactionId);

        // Verify payment
        const payment = await Payment.findOne({ transactionId, done: true });
        if (!payment) {
            console.error("Payment not found or not completed:", transactionId);
            await twilioClient.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: from,
                body: "Payment not found or not completed. Please check your Transaction ID.",
            });
            return NextResponse.json({ success: false, message: "Payment not found" });
        }

        console.log("Payment Found:", JSON.stringify(payment.toObject(), null, 2));

        // Generate PDF
        const doc = new PDFDocument();
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));

        // Create PDF content
        doc.fontSize(20).text("Payment Receipt", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Name: ${payment.name || "Unknown"}`);
        doc.text(`Amount: ₹${payment.amount || 0}`);
        doc.text(`Message: ${payment.message || "No message"}`);
        doc.text(`UPI ID: ${payment.upiId || "Not available"}`);
        doc.text(`Transaction ID: ${payment.transactionId || "Not available"}`);
        doc.text(`Razorpay Payment ID: ${payment.razorpayPaymentId || "Not available"}`);
        doc.text(`Date: ${payment.updatedAt ? new Date(payment.updatedAt).toLocaleString() : "N/A"}`);
        doc.text(`Recipient: ${payment.to_user}`);

        // Save PDF to receipts directory
        const receiptsDir = path.join(process.cwd(), "receipts");
        await fs.mkdir(receiptsDir, { recursive: true });
        const fileName = `receipt-${transactionId}.pdf`;
        const filePath = path.join(receiptsDir, fileName);

        const writeStream = require("fs").createWriteStream(filePath);
        doc.pipe(writeStream);
        doc.end();

        // Wait for PDF to be written
        await new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
        });

        console.log("PDF Generated:", filePath);

        // Generate URL for the PDF
        const pdfUrl = `${process.env.NEXT_PUBLIC_URL}/api/receipts/${fileName}`;
        console.log("PDF URL:", pdfUrl);

        // Send PDF via Twilio
        await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: from,
            body: "Here is your payment receipt.",
            mediaUrl: [pdfUrl],
        });

        console.log("PDF Sent to:", from);

        return NextResponse.json({ success: true, message: "Receipt sent", pdfUrl });
    } catch (error) {
        console.error("Error in WhatsApp webhook:", error.message, error.stack);
        try {
            await twilioClient.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: params.From || "whatsapp:+1234567890",
                body: "An error occurred. Please try again later.",
            });
        } catch (sendError) {
            console.error("Error sending error message:", sendError.message);
        }
        return NextResponse.json({ success: false, message: "Server error", error: error.message });
    }
}