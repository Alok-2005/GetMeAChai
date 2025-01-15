"use client"
import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authstore";
import {toast} from "react-hot-toast";

import { useRouter } from 'next/navigation';


const page = () => {
  const [code, setcode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
//   const navigate = useNavigate();
const router = useRouter();


  const {error,isLoading,verifyEmail}=useAuthStore()
  const handleChange = (index, value) => {
    const newCode = [...code];
    // Handle pasted code
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setcode(newCode);

      // focus on last non empty input or the first empty input
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setcode(newCode);

      // Move focus to next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };


  const handleSubmit=async(e)=>{
    e.preventDefault()
const verificationCode=code.join("")

try{
await verifyEmail(verificationCode)
// navigate("/")
router.push("/dashboard");

toast.success("Email verified successfully")
console.log("verified")
}catch(error){
    console.log(error)
    toast.error("Verification failed. Please try again.");
}
// console.log(`Verification code submitted: ${verificationCode} `)
  }
//   Auto submit when all fields all filled
useEffect(() => {
  if(code.every(digit=>digit!=='')){
    handleSubmit(new Event('submit'))
  }
}, [code])


  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden m-auto mt-[150px] ">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md "
      >
        <h2 className="text-3xl font-bold mb-6 text-clip bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
          Verify{" "}
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email adddress
        </p>

        <form className="space-y-4"  onSubmit={handleSubmit}>
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(e) => (inputRefs.current[index] = e)}
                type="text"
                maxlength="6"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-400 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>

{/* {error && <p className="text-red-500 font-semibold mt-2 ">{error}</p>} */}

          <motion.button
            className=" w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
          >
            {isLoading ? "Vefifying...." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default page;
