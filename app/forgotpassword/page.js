"use client"
import React, { useState } from 'react'
import {motion } from "framer-motion"
import { useAuthStore } from '../store/authstore'
import Input from '../login/Input'
import { ArrowLeft, Mail } from 'lucide-react'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
const page = () => {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const {isLoading,forgotPassword}=useAuthStore()
const handleSubmit=async(e)=>{
    e.preventDefault()
   await forgotPassword(email)
   setIsSubmitted(true)
toast.success("Password reset link sent to your email")
}

  return (
   <motion.div
   initial={{opacity:0,y:20}}
   animate={{opacity:1,y:0}}
   transition={{duration:0.5}}
   className='max-w-md  shadow-xl overflow-hidden  mx-auto py-20'
     >

<div className='p-8 my-auto'>
    <h2 className='text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text'>Forgot Password</h2>
{!isSubmitted ? (
<form onSubmit={handleSubmit}>
    <p className='text-gray-300 mb-6 text-center'>Enter your email address and we'll send you a link to reset your password</p>
    <Input
    icon={Mail}
    type="email"
    name="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    />
    <motion.button
    whileHover={{scale:1.02}}
    whileTap={{scale:0.98}}
    className='w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-lg '
    type='submit'
    
    >
        {/* Send  */}
       {isLoading ? <Loader className="size-6 animate-spin mx-auto"/>:"Send Reset Link"} 
    </motion.button>
</form>
):(
<div className='text-center'>
    <motion.div
    initial={{scale:0}}
    animate={{scale:1}}
    transition={{type:"spring",stiffness:500,damping:30}}
    className='w-16 h-16 bg-green-500 rounded-full flex justify-center items-center mx-auto mt-5 '
    >
<Mail className="h-8 w-8 text-white"/>
    </motion.div>
    <p className='text-gray-300 mb-6'>If Account exists for {email} , you will receive a password reset link shortly</p>
</div>

)}
</div>
<div className='px-8 py-4 bg-gray-900 bg-opacity-30 flex justify-center rounded-xl'>
    <Link href={"/login"} className="text-sm text-green-400 hover:underline flex justify-center items-center">
    <ArrowLeft className='h-4 w-4 mr-2 '/>Back to login
    </Link>
</div>
   </motion.div>
  )
}

export default page
