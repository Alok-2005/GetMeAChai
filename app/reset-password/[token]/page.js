"use client"
import React, { useState } from 'react'
import { useAuthStore } from '../../store/authstore'
// import {  useParams } from 'react-router-dom'
import { Lock } from 'lucide-react'
import {motion} from "framer-motion"
import Input from '../../login/Input'
import {toast} from 'react-hot-toast'
import PasswordStrengthMeter from '../../login/PasswordStrengthMeter'
import { useRouter, useParams } from 'next/navigation';

const page = () => {
    const [password, setpassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const {resetPassword,error,isLoading,message}=useAuthStore()

    const {token}=useParams()

    const router = useRouter();
    // const searchParams = useSearchParams();
    // const token = searchParams.get('token');
    // const {token}=useParams()
    // const navigate=useNavigate()
    // const router = useRouter();

    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(password!==confirmPassword){
            // alert("Passwords do not match")
            toast.error("Passwords do not match")
            return
            }
          try{ 
            await  resetPassword(token,password)
           toast.success("Password reset successfully,redirecting to the login page...")
           setTimeout(() => {
        //    navigate("/login")
        router.push("/login")
            
           }, 3000);
            }catch(error){
                toast.error(error.message || "Error resetting password")
                }
            }
    

  return (
    <motion.div
    initial={{ opacity: 0,y:20 }}
    animate={{ opacity: 1,y:0 }}
    transition={{duration:0.5}}
    className="max-w-md w-full h-full mx-auto my-auto bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mt-3"
    >
<div className='p-8'>
    <h2 className='text-3xl bg-gradient-to-r from-purple-500 to-blue-500 font-bold mb-4  text-transparent bg-clip-text'>Reset Password</h2>
{error && <p className='text-red-500 text-sm mb-4 '>{error}</p>}
{error && <p className='text-green-500 text-sm mb-4 '>{message}</p>}
<form onSubmit={handleSubmit}>
    <Input
    icon={Lock}
    type="password"
    placeholder="New Password"
    value={password}
    onChange={(e)=>setpassword(e.target.value)}
    required
    />
    <Input
    icon={Lock}
    type="password"
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e)=>setConfirmPassword(e.target.value)}
    required
    />

<PasswordStrengthMeter password={password} />

    <motion.button
    whileHover={{scale:1.02}}
    whileTap={{scale:0.98}}
    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 mt-4"
    type="submit"
disabled={isLoading}
    >
{isLoading ? "Resetting...":"Set New Password" }
    </motion.button>
</form>
</div>
    </motion.div>
  )
}
export default page
