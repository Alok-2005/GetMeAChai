"use server";

import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import Payment from "../models/Payment";
import connectDb from "../db/connectDb";
import User from "../models/User";

export const initiate = async (amount, to_username, paymentform) => {
    await connectDb();
    let user = await User.findOne({ username: to_username });
    if (!user) {
        throw new Error("User not found");
    }
    const secret = user.razorpaysecret;

    var instance = new Razorpay({ key_id: user.razorpayid, key_secret: secret });

    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    };

    let x = await instance.orders.create(options);

    // Generate a unique transaction ID
    const transactionId = uuidv4();

    // Create a payment object with unique transactionId
    await Payment.create({
        oid: x.id,
        amount: amount / 100,
        to_user: to_username,
        name: paymentform.name,
        message: paymentform.message,
        upiId: "N/A",
        transactionId: transactionId, // Unique ID
    });

    return x;
};

export const fetchuser = async (username) => {
    await connectDb();
    let u = await User.findOne({ username: username });
    let user = u.toObject({ flattenObjectIds: true });
    return user;
};

export const fetchpayments = async (username) => {
    await connectDb();
    let p = await Payment.find({ to_user: username, done: true })
        .sort({ updatedAt: -1 }) // Sort by updatedAt to get latest payment
        .limit(10)
        .lean();
    return p;
};

export const updateProfile = async (data, oldusername) => {
    await connectDb();
    let ndata = Object.fromEntries(data);

    if (oldusername !== ndata.username) {
        let u = await User.findOne({ username: ndata.username });
        if (u) {
            return { error: "Username already exists" };
        }
        await User.updateOne({ email: ndata.email }, ndata);
        await Payment.updateMany({ to_user: oldusername }, { to_user: ndata.username });
    } else {
        await User.updateOne({ email: ndata.email }, ndata);
    }
};