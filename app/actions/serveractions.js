"use server";

import Razorpay from "razorpay";
import Payment from "../models/Payment";
import connectDb from "../db/connectDb";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

export const initiate = async (amount, to_username, paymentform) => {
  try {
    await connectDb();
    const user = await User.findOne({ username: to_username });
    if (!user) {
      throw new Error("Recipient user not found");
    }

    // Use user credentials or fallback to environment variables
    const keyId = user.razorpayid || process.env.NEXT_PUBLIC_KEY_ID;
    const keySecret = user.razorpaysecret || process.env.KEY_SECRET;

    // Log credentials for debugging (avoid logging secrets in production)
    console.log("Razorpay credentials:", {
      keyId,
      keySecret: keySecret ? "[REDACTED]" : null,
      to_username,
      amount,
    });

    // Validate Razorpay credentials
    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }

    // Initialize Razorpay
    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Create Razorpay order
    const options = {
      amount: Number.parseInt(amount), // Amount in paise
      currency: "INR",
      receipt: `receipt_${to_username}_${Date.now()}`,
    };
    console.log("Creating Razorpay order with options:", options);
    const order = await instance.orders.create(options);

    // Create a pending payment
    await Payment.create({
      oid: order.id,
      amount: amount / 100, // Store in INR
      to_user: to_username,
      name: paymentform.name,
      message: paymentform.message,
      done: false,
    });

    return order;
  } catch (error) {
    console.error("Error in initiate:", error);
    const errorMessage =
      error.message || (error.error && error.error.description) || "Unknown error";
    throw new Error(`Failed to initiate payment: ${errorMessage}`);
  }
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
    .sort({ amount: -1 })
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
      return { error: "username already exists" };
    }
    await User.updateOne({ email: ndata.email }, ndata);
    await User.updateMany({ to_user: oldusername }, { to_user: ndata.username });
  } else {
    await User.updateOne({ email: ndata.email }, ndata);
  }
};