"use client";
import React, { useEffect, useCallback } from "react";
import Script from "next/script";
import Image from "next/image";
import user from "@/app/images/user.gif";
import { fetchpayments, initiate } from "../actions/serveractions";
import { useState } from "react";
import { fetchuser } from "../actions/serveractions";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const PaymentPage = ({ username }) => {
  const [paymentform, setpaymentform] = useState({
    name: "",
    message: "",
    amount: "",
  });
  const [currentUser, setcurrentUser] = useState({});
  const [payments, setPayments] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const getData = useCallback(async () => {
    let u = await fetchuser(username);
    setcurrentUser(u);
    let dbPayments = await fetchpayments(username);
    setPayments(dbPayments);
  }, [username]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (searchParams.get("paymentdone") === "true") {
      toast.success("Thanks for your donation");
      router.push(`/${username}`);
    }
  }, [searchParams, router, username]);

  const handleChange = (e) => {
    setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
  };

  const pay = async (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const a = await initiate(amount, username, paymentform);
      const orderId = a.id;
      const options = {
        key: process.env.NEXT_PUBLIC_KEY_ID || currentUser.razorpayid,
        amount: amount,
        currency: 'INR',
        name: 'Fund My Chai',
        description: 'Test Transaction',
        image: 'https://example.com/your_logo',
        order_id: orderId,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
        prefill: {
          name: paymentform.name,
          email: 'gaurav.kumar@example.com',
          contact: '9000090000',
        },
        notes: {
          address: 'Razorpay Corporate Office',
          username,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error(`Failed to initiate payment: ${error.message}`);
    }
  };

  return (
    <>
      <Toaster/>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

      <div className="text-white cover w-full relative">
        {currentUser.coverpic && (
          <Image
            src={currentUser.coverpic}
            alt="Cover photo"
            width={1200}
            height={350}
            className="object-cover w-full h-[350px]"
            priority
          />
        )}
        <div className="absolute -bottom-20 right-[46%]">
          {currentUser.profilepic && (
            <Image
              className="rounded-full"
              width={120}
              height={120}
              src={currentUser.profilepic}
              alt="Profile picture"
            />
          )}
        </div>
      </div>
      
      <div className="info flex justify-center items-center my-20 flex-col gap-2">
        <div className="font-bold text-lg">@{username}</div>
        <div className="text-slate-400">
          Lets help {currentUser.name} to get a chai
        </div>
        <div className="text-slate-400">
          {payments.length} Payments | ₹
          {payments.reduce((a, b) => a + b.amount, 0)} raised
        </div>

        <div className="payments flex gap-3 w-[80%] my-11">
          <div className="supporters w-1/2 bg-slate-900 text-white rounded-lg p-10">
            <h2 className="text-lg font-bold my-5">Supporters</h2>
            <ul className="mx-5 text-lg">
              {payments.length === 0 && <li>No Payments yet</li>}
              {payments.map((p, i) => (
                <li key={i} className="flex gap-2 items-center my-4">
                  <Image
                    src={user}
                    width={30}
                    height={30}
                    className="rounded-full"
                    alt="Supporter"
                  />
                  <span>
                    {p.name} donated{" "}
                    <span className="font-bold">₹{p.amount}</span> with a
                    message &quot;{p.message}&quot;
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="makepayments w-1/2 bg-slate-900 text-white rounded-lg p-10">
            <h2 className="text-2xl font-bold my-5">Make A Payment</h2>
            <div className="flex gap-2 flex-col">
              <input
                onChange={handleChange}
                name="name"
                value={paymentform.name}
                type="text"
                className="w-full rounded-lg bg-slate-800 p-3"
                placeholder="Enter Name"
                required
              />
              <input
                onChange={handleChange}
                name="message"
                value={paymentform.message}
                type="text"
                className="w-full rounded-lg bg-slate-800 p-3"
                placeholder="Enter Message"
                required
              />
              <input
                onChange={handleChange}
                name="amount"
                value={paymentform.amount}
                type="text"
                className="w-full rounded-lg bg-slate-800 p-3"
                placeholder="Enter Amount"
              />

              <button
                onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
                type="submit"
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100"
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4 ||
                  paymentform.amount?.length < 2
                }
              >
                Pay
              </button>
            </div>

            <div className="my-5 flex gap-4">
              <button
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100"
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4
                }
                onClick={() => pay(1000)}
              >
                Pay ₹10
              </button>
              <button
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100"
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4
                }
                onClick={() => pay(2000)}
              >
                Pay ₹20
              </button>
              <button
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100"
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4
                }
                onClick={() => pay(3000)}
              >
                Pay ₹30
              </button>
              <button
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100"
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4
                }
                onClick={() => pay(5000)}
              >
                Pay ₹50
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;