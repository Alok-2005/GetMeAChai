"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { fetchuser, fetchpayments, initiate } from "../actions/serveractions";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

const PaymentPage = ({ username }) => {
    const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" });
    const [currentUser, setcurrentUser] = useState({});
    const [payments, setPayments] = useState([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (searchParams.get("paymentdone") === "true") {
            toast("Thanks for your donation!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            setTimeout(getData, 1000);
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
    };

    const getData = async () => {
        try {
            let u = await fetchuser(username);
            setcurrentUser(u);
            let dbpayments = await fetchpayments(username);
            console.log("Payments Fetched:", JSON.stringify(dbpayments, null, 2));
            setPayments(dbpayments);
        } catch (error) {
            console.error("Error fetching data:", error.message, error.stack);
            toast.error("Failed to fetch data");
        }
    };

    const pay = async (amount) => {
        try {
            let a = await initiate(amount, username, paymentform);
            let orderId = a.id;
            var options = {
                key: currentUser.razorpayid,
                amount: amount,
                currency: "INR",
                name: "Get Me A Chai",
                description: "Test Transaction",
                image: "https://example.com/your_logo",
                order_id: orderId,
                callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
                prefill: {
                    name: "Gaurav Kumar",
                    email: "gaurav.kumar@example.com",
                    contact: "9000090000",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            var rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Error initiating payment:", error.message, error.stack);
            toast.error("Failed to initiate payment");
        }
    };

    const latestPayment = payments
        .filter((p) => p.done)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

    console.log("Latest Payment:", JSON.stringify(latestPayment, null, 2));

    // Create WhatsApp share link
    const generateWhatsAppLink = (payment) => {
        if (!payment) return "#";
        const message = `Payment Details:\nName: ${payment.name || "Unknown"}\nAmount: ₹${payment.amount || 0}\nMessage: ${payment.message || "No message"}\nUPI ID: ${payment.upiId || "Not available"}\nTransaction ID: ${payment.transactionId || "Not available"}\nRazorpay Payment ID: ${payment.razorpayPaymentId || "Not available"}\nUpdated At: ${payment.updatedAt ? new Date(payment.updatedAt).toLocaleString() : "N/A"}`;
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${process.env.NEXT_PUBLIC_TWILIO_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            <div className="cover w-full bg-red-50 relative">
                <img
                    className="object-cover w-full h-48 md:h-[350px] shadow-blue-700 shadow-sm"
                    src={currentUser.coverpic || "/default-cover.jpg"}
                    alt="Cover"
                />
                <div className="absolute -bottom-20 right-[33%] md:right-[46%] border-white overflow-hidden border-2 rounded-full size-36">
                    <img
                        className="rounded-full object-cover size-36"
                        width={128}
                        height={128}
                        src={currentUser.profilepic || "/default-profile.jpg"}
                        alt="Profile"
                    />
                </div>
            </div>
            <div className="info flex justify-center items-center my-24 mb-32 flex-col gap-2">
                <div className="font-bold text-lg">@{username}</div>
                <div className="text-slate-400">Let's help {username} get a chai!</div>
                <div className="text-slate-400">
                    {payments.length} Payments . ₹{payments.reduce((a, b) => a + b.amount, 0)} raised
                </div>

                {searchParams.get("paymentdone") === "true" && (
                    <div className="latest-transaction mt-5 p-4 bg-slate-800 rounded-lg text-white w-[80%]">
                        <h3 className="text-xl font-bold">Recent Transaction Details</h3>
                        {latestPayment ? (
                            <>
                                <p><strong>Name:</strong> {latestPayment.name || "Unknown"}</p>
                                <p><strong>Amount:</strong> ₹{latestPayment.amount || 0}</p>
                                <p><strong>Message:</strong> {latestPayment.message || "No message"}</p>
                                <p><strong>UPI ID:</strong> {latestPayment.upiId || "Not available"}</p>
                                <p><strong>Transaction ID:</strong> {latestPayment.transactionId || "Not available"}</p>
                                <p><strong>Razorpay Payment ID:</strong> {latestPayment.razorpayPaymentId || "Not available"}</p>
                                <p><strong>Updated At:</strong> {latestPayment.updatedAt ? new Date(latestPayment.updatedAt).toLocaleString() : "N/A"}</p>
                                <a
                                    href={generateWhatsAppLink(latestPayment)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Share via WhatsApp
                                </a>
                            </>
                        ) : (
                            <p>No recent payment found. Please try again.</p>
                        )}
                    </div>
                )}

                <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
                    <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
                        <h2 className="text-2xl font-bold my-5">Top 10 Supporters</h2>
                        <ul className="mx-5 text-lg">
                            {payments.length === 0 && <li>No payments yet</li>}
                            {payments.map((p, i) => (
                                <li key={i} className="my-4 flex gap-2 items-center">
                                    <img width={33} src="avatar.gif" alt="user avatar" />
                                    <span>
                                        {p.name} donated <span className="font-bold">₹{p.amount}</span> with a
                                        message "{p.message}"
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
                        <h2 className="text-2xl font-bold my-5">Make a Payment</h2>
                        <div className="flex gap-2 flex-col">
                            <input
                                onChange={handleChange}
                                value={paymentform.name}
                                name="name"
                                type="text"
                                className="w-full p-3 rounded-lg bg-slate-800"
                                placeholder="Enter Name"
                            />
                            <input
                                onChange={handleChange}
                                value={paymentform.message}
                                name="message"
                                type="text"
                                className="w-full p-3 rounded-lg bg-slate-800"
                                placeholder="Enter Message"
                            />
                            <input
                                onChange={handleChange}
                                value={paymentform.amount}
                                name="amount"
                                type="text"
                                className="w-full p-3 rounded-lg bg-slate-800"
                                placeholder="Enter Amount"
                            />
                            <button
                                onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
                                type="button"
                                className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100"
                                disabled={
                                    paymentform.name?.length < 3 ||
                                    paymentform.message?.length < 4 ||
                                    paymentform.amount?.length < 1
                                }
                            >
                                Pay
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 mt-5">
                            <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(1000)}>
                                Pay ₹10
                            </button>
                            <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(2000)}>
                                Pay ₹20
                            </button>
                            <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(3000)}>
                                Pay ₹30
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentPage;