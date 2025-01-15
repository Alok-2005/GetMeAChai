"use client";
import React, { useEffect } from "react";
import Script from "next/script";
import Image from "next/image";
import user from "@/app/images/user.gif";
import { fetchpayments, initiate } from "../actions/serveractions";
import { useState } from "react";
import { fetchuser } from "../actions/serveractions";
import { useSearchParams } from "next/navigation";

// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";
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
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (searchParams.get("paymentdone") == "true") {
toast.success("Thanks for your donation ", )
      // toast.success("Thanks for your donation ", {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "dark",
      //   transition: Slide,
      // });
    }
    router.push(`/${username}`);
  }, []);

  // const { data: session } = useSession();

  const handleChange = (e) => {
    setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
  };
  const getData = async () => {
    let u = await fetchuser(username);
    setcurrentUser(u);
    let dbPayments = await fetchpayments(username);
    setPayments(dbPayments);
  };

  const pay = async (amount) => {
    // get order id
    let a = await initiate(amount, username, paymentform);
    let orderId = a.id;
    var options = {
      key: currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
      amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Fund My Chai", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        name: "Gaurav Kumar", //your customer's name
        email: "gaurav.kumar@example.com",
        contact: "9000090000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
  };

  return (
    <>
    <Toaster/>
      {/* <ToastContainer
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
      /> */}
      {/* Same as */}
      {/* <ToastContainer /> */}

      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      <div className="text-white cover w-full relative ">
        <img
          className="object-cover w-full h-[350px]"
          src={currentUser.coverpic}
          alt=""
        />
        <div className="absolute -bottom-20 right-[46%] ">
          <img
            className="rounded-full"
            width={120}
            height={120}
            src={currentUser.profilepic}
            alt=""
          />
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
          <div className="supporters w-1/2 bg-slate-900 text-white rounded-lg p-10  ">
            {/* Show list of supporters */}
            <h2 className="text-lg font-bold my-5">Supporters</h2>
            <ul className="mx-5 text-lg">
              {payments.length === 0 && <li>No Payments yet</li>}
              {payments.map((p, i) => {
                return (
                  <li className="flex gap-2 items-center my-4">
                    <Image
                      src={user}
                      width={30}
                      className="rounded-full "
                    ></Image>
                    <span>
                      {p.name} donated{" "}
                      <span className="font-bold ">₹{p.amount} </span> with a
                      message "{p.message}"
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="makepayments w-1/2 bg-slate-900 text-white rounded-lg p-10 ">
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
                class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  
           disabled:bg-slate-600 disabled:from-purple-100 "
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4 ||
                  paymentform.amount?.length < 2
                }
              >
                Pay
              </button>
            </div>

            {/* or choose form these */}
            <div className="my-5 flex gap-4">
              <button
                class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  
disabled:bg-slate-600 disabled:from-purple-100 "
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4
                }
                // className="bg-slate-800 p-3 rounded-lg"
                onClick={() => pay(1000)}
              >
                Pay ₹10
              </button>
              <button
                class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  
disabled:bg-slate-600 disabled:from-purple-100 "
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4
                }
                // className="bg-slate-800 p-3 rounded-lg"
                onClick={() => pay(2000)}
              >
                Pay ₹20
              </button>
              <button
                class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  
           disabled:bg-slate-600 disabled:from-purple-100 "
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4
                }
                // className="bg-slate-800 p-3 rounded-lg"
                onClick={() => pay(3000)}
              >
                Pay ₹30
              </button>

              <button
                class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  
           disabled:bg-slate-600 disabled:from-purple-100 "
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4
                }
                // className="bg-slate-800 p-3 rounded-lg"
                onClick={() => pay(3000)}
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
