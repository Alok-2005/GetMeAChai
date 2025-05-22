"use client"
import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { useSession } from 'next-auth/react'
import { fetchuser, fetchpayments, initiate } from '../actions/serveractions'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { useRouter } from 'next/navigation'
import { notFound } from "next/navigation"
import user from "@/app/images/user.gif";
import Image from 'next/image'

const PaymentPage = ({ username }) => {
    const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" })
    const [currentUser, setcurrentUser] = useState({})
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (searchParams.get("paymentdone") === "true") {
            toast.success('Thanks for your generous support!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
                transition: Bounce,
            });
            router.push(`/${username}`)
        }
    }, [])

    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }

    const getData = async () => {
        try {
            setLoading(true)
            setError(null)
            const userData = await fetchuser(username)
            if (!userData) {
                throw new Error("User not found")
            }
            setcurrentUser(userData)
            const dbpayments = await fetchpayments(username)
            setPayments(dbpayments)
        } catch (err) {
            setError(err.message)
            toast.error(`Error: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            })
            if (err.message === "User not found") {
                notFound()
            }
        } finally {
            setLoading(false)
        }
    }

    const pay = async (amount) => {
        try {
            const order = await initiate(amount, username, paymentform)
            if (!order?.id) {
                throw new Error("Failed to initiate payment")
            }
            const options = {
                "key": currentUser.razorpayid,
                "amount": amount,
                "currency": "INR",
                "name": "Get Me A Chai",
                "description": "Support Your Favorite Creator",
                "image": "https://example.com/your_logo",
                "order_id": order.id,
                "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
                "prefill": {
                    "name": paymentform.name || "Anonymous",
                    "email": "user@example.com",
                    "contact": "9000090000"
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#7C3AED"
                }
            }

            const rzp1 = new Razorpay(options)
            rzp1.on('payment.failed', function (response) {
                toast.error('Payment failed. Please try again.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                })
            })
            rzp1.open()
        } catch (err) {
            toast.error(`Payment Error: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            })
        }
    }

    const isFormValid = paymentform.name?.length >= 3 && paymentform.message?.length >= 4

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
                theme="colored"
            />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                {/* Cover Image Section */}
                <div className="cover w-full relative">
                    <img
                        className="object-cover w-full h-48 sm:h-64 md:h-72 lg:h-96 shadow-lg transition-transform duration-500 "
                        src={currentUser.coverpic || "/placeholder-cover.jpg"}
                        alt="Cover"
                    />
                    <div className="absolute -bottom-12 sm:-bottom-14 left-1/2 transform -translate-x-1/2 border-4 border-purple-600 rounded-full size-24 sm:size-28 md:size-32 lg:size-40 overflow-hidden shadow-xl">
                        <img
                            className="rounded-full object-cover size-full"
                            src={currentUser.profilepic || "/placeholder-profile.jpg"}
                            alt="Profile"
                        />
                    </div>
                </div>

                {/* User Info Section */}
                <div className="info flex justify-center items-center my-16 sm:my-20 md:my-24 flex-col gap-4 text-center px-4">
                    <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                        @{username}
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg md:text-xl">
                        Fuel {username}'s passion with a chai! ☕
                    </p>
                    <div className="text-gray-400 text-sm sm:text-base">
                        <span className="font-semibold">{payments.length}</span> Supporters | <span className="font-semibold">₹{payments.reduce((a, b) => a + b.amount, 0)}</span> Raised
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full sm:w-3/4 md:w-1/2 mt-4">
                        <div className="bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((payments.reduce((a, b) => a + b.amount, 0) / 10000) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                            {Math.min((payments.reduce((a, b) => a + b.amount, 0) / 10000) * 100, 100).toFixed(1)}% of ₹10,000 goal
                        </p>
                    </div>
                </div>

                {/* Payment and Supporters Section */}
                <div className="payment container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 flex flex-col md:flex-row gap-6 sm:gap-8 mb-16">
                    {/* Supporters Leaderboard */}
                    <div className="supporters w-full md:w-1/2 bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg transition-all duration-300 hover:shadow-2xl">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-purple-400">
                            Top Supporters ({payments.length}) 🌟
                        </h2>
                        {loading ? (
                            <div className="text-gray-400 text-base sm:text-lg animate-pulse">Loading supporters...</div>
                        ) : error ? (
                            <div className="text-red-400 text-base sm:text-lg">Error: {error}</div>
                        ) : (
                            <ul className="max-h-80 sm:max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {payments.length === 0 ? (
                                    <li className="text-gray-400 text-base sm:text-lg">Be the first to support!</li>
                                ) : (
                                    payments.map((p, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200 animate-fade-in"
                                            style={{ animationDelay: `${i * 100}ms` }}
                                        >
                                            <Image
                                                src={user}
                                                width={32}
                                                height={32}
                                                className="rounded-full sm:w-10 sm:h-10"
                                                alt={`Supporter ${p.name}`}
                                            />
                                            <div className="flex-1 text-sm sm:text-base">
                                                <div className="flex justify-between items-center">
                                                    <span>
                                                        <span className="font-semibold">{p.name}</span> donated <span className="font-bold text-purple-400">₹{p.amount}</span>
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {p.createdAt ? new Date(p.createdAt).toLocaleString() : 'No date'}
                                                    </span>
                                                </div>
                                                <span className="text-gray-300 block">"{p.message}"</span>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Make a Payment Form */}
                    <div className="makePayment w-full md:w-1/2 bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg transition-all duration-300 hover:shadow-2xl">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-purple-400">Make a Contribution 🚀</h2>
                        <div className="flex flex-col gap-4">
                            <input
                                onChange={handleChange}
                                value={paymentform.name}
                                name="name"
                                type="text"
                                className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                placeholder="Your Name"
                                aria-label="Your Name"
                            />
                            <input
                                onChange={handleChange}
                                value={paymentform.message}
                                name="message"
                                type="text"
                                className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                placeholder="Your Message"
                                aria-label="Your Message"
                            />
                            <input
                                onChange={handleChange}
                                value={paymentform.amount}
                                name="amount"
                                type="number"
                                className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                placeholder="Enter Amount (₹)"
                                aria-label="Donation Amount"
                            />
                            <button
                                onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
                                type="button"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                disabled={!isFormValid || paymentform.amount?.length < 1}
                                aria-label="Submit Donation"
                            >
                                Support Now
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                className="flex-1 bg-gray-700 p-3 rounded-lg hover:bg-purple-600 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                onClick={() => pay(1000)}
                                disabled={!isFormValid}
                                aria-label="Donate ₹10"
                            >
                                Pay ₹10
                            </button>
                            <button
                                className="flex-1 bg-gray-700 p-3 rounded-lg hover:bg-purple-600 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                onClick={() => pay(2000)}
                                disabled={!isFormValid}
                                aria-label="Donate ₹20"
                            >
                                Pay ₹20
                            </button>
                            <button
                                className="flex-1 bg-gray-700 p-3 rounded-lg hover:bg-purple-600 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                onClick={() => pay(3000)}
                                disabled={!isFormValid}
                                aria-label="Donate ₹30"
                            >
                                Pay ₹30
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar CSS */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #2d3748;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #7c3aed;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9f7aea;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </>
    )
}

export default PaymentPage