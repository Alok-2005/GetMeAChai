"use server";

import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";
import Payment from "../models/Payment";
import connectDb from "../db/connectDb";
import User from "../models/User";

export const initiate = async (amount, to_username, paymentform) => {
    await connectDb();
    let user = await User.findOne({ username: to_username });
    if (!user) {
        console.error("User not found:", to_username);
        throw new Error("User not found");
    }
    const secret = user.razorpaysecret;

    try {
        var instance = new Razorpay({ key_id: user.razorpayid, key_secret: secret });

        let options = {
            amount: Number.parseInt(amount),
            currency: "INR",
        };

        let x = await instance.orders.create(options);
        console.log("Order Created:", JSON.stringify(x, null, 2));

        const transactionId = uuidv4();
        const payment = await Payment.create({
            oid: x.id,
            amount: amount / 100,
            to_user: to_username,
            name: paymentform.name,
            message: paymentform.message,
            upiId: "N/A",
            transactionId: transactionId,
            razorpayPaymentId: "N/A",
        });

        console.log("Payment Created:", JSON.stringify(payment.toObject(), null, 2));

        return x;
    } catch (error) {
        console.error("Error in initiate:", error.message, error.stack);
        throw new Error("Failed to initiate payment");
    }
};

export const fetchuser = async (username) => {
    await connectDb();
    try {
        let u = await User.findOne({ username: username });
        if (!u) {
            console.error("User not found:", username);
            throw new Error("User not found");
        }
        let user = u.toObject({ flattenObjectIds: true });
        return user;
    } catch (error) {
        console.error("Error in fetchuser:", error.message, error.stack);
        throw error;
    }
};

export const fetchpayments = async (username) => {
    await connectDb();
    try {
        let p = await Payment.find({ to_user: username, done: true })
            .sort({ updatedAt: -1 })
            .limit(10)
            .lean();
        console.log("Payments Fetched for", username, ":", JSON.stringify(p, null, 2));
        return p;
    } catch (error) {
        console.error("Error in fetchpayments:", error.message, error.stack);
        throw error;
    }
};

export const updateProfile = async (data, oldusername) => {
    await connectDb();
    let ndata = Object.fromEntries(data);

    try {
        if (oldusername !== ndata.username) {
            let u = await User.findOne({ username: ndata.username });
            if (u) {
                return { error: "Username already exists" };
            }
            await User.updateOne({ email: ndata.email }, ndata);
            await Payment.updateMany({ to_user: oldusername }, { to_user: ndata.username });
        }
        await User.updateOne({ email: ndata.email }, ndata);
    } catch (error) {
        console.error("Error in updateProfile:", error.message, error.stack);
        throw error;
    }
};