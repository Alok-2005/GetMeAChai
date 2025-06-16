import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/app/models/Payment";
import Razorpay from "razorpay";
import connectDb from "@/app/db/connectDb";
import User from "@/app/models/User";

export const POST = async (req) => {
    await connectDb();
    let body = await req.formData();
    body = Object.fromEntries(body);

    console.log("Razorpay Callback Body:", JSON.stringify(body, null, 2));

    // Check if razorpayOrderId is present
    let payment = await Payment.findOne({ oid: body.razorpay_order_id });
    if (!payment) {
        console.error("Order ID not found:", body.razorpay_order_id);
        return NextResponse.json({ success: false, message: "Order Id not found" });
    }

    // Fetch the user who is receiving the payment
    let user = await User.findOne({ username: payment.to_user });
    if (!user) {
        console.error("User not found for username:", payment.to_user);
        return NextResponse.json({ success: false, message: "User not found" });
    }
    const secret = user.razorpaysecret;

    // Verify the payment
    let isValid = validatePaymentVerification(
        { order_id: body.razorpay_order_id, payment_id: body.razorpay_payment_id },
        body.razorpay_signature,
        secret
    );

    console.log("Payment Verification Result:", isValid);

    if (isValid) {
        // Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: user.razorpayid,
            key_secret: user.razorpaysecret,
        });

        try {
            // Fetch payment details
            const paymentDetails = await razorpay.payments.fetch(body.razorpay_payment_id);
            console.log("Payment Details:", JSON.stringify(paymentDetails, null, 2));

            // Check payment method and extract UPI ID
            const isUpi = paymentDetails.method === "upi";
            const upiId = isUpi ? paymentDetails.vpa || "N/A" : "N/A";
            const transactionId = paymentDetails.id || "N/A";

            // Update payment with UPI ID and transaction ID
            const updatedPayment = await Payment.findOneAndUpdate(
                { oid: body.razorpay_order_id },
                {
                    done: true,
                    upiId: upiId,
                    transactionId: transactionId,
                    updatedAt: Date.now(),
                },
                { new: true }
            );

            if (!updatedPayment) {
                console.error("Failed to update payment for order:", body.razorpay_order_id);
                return NextResponse.json({ success: false, message: "Failed to update payment" });
            }

            console.log("Updated Payment:", JSON.stringify(updatedPayment.toObject(), null, 2));

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`
            );
        } catch (error) {
            console.error("Error fetching payment details:", error.message, error.stack);
            return NextResponse.json({
                success: false,
                message: "Error fetching payment details",
                error: error.message,
            });
        }
    } else {
        console.error("Payment verification failed for order:", body.razorpay_order_id);
        return NextResponse.json({ success: false, message: "Payment Verification Failed" });
    }
};