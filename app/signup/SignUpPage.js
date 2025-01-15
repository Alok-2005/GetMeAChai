"use client"
import React, { useState } from 'react'
import { Mail,Lock,User } from 'lucide-react'
import Input from '../login/Input'
import PasswordStrengthMeter from '../login/PasswordStrengthMeter'
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'
// import { useNavigate } from 'react-router-dom'
import Link from 'next/link'
import { useAuthStore } from '../store/authstore'
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const { data: session } = useSession();

      const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    // if (password !== confirmPassword) {
    //   toast.error("Passwords do not match");
    //   return;
    // }
    try {
      await signup(email, password, name);
      router.push("/VerifyEmail");
      toast.success("Verification email sent successfully");
    } catch (error) {
      console.log(error);
      toast.error("User already exists");
    }
  };

  return (
   <>
    <motion.div
    initial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.5}}
    className=' rounded-2xl shadow-xl overflow-hidden h-[550px] w-[800px] -mt-10'
    >
   <div className='mx-60 -mt-1'>
  <h2 className='text-3xl font-bold mb-5 text-center bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text'>
    Create Account
  </h2>
  <form onSubmit={handleSignUp}>
  <Input
icon={User}
type='text'
name='name'
placeholder='Full Name'
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

<Input
icon={Mail}
type='email'
name='email'
placeholder='Email Address'
value={email}
onChange={(e)=>setEmail(e.target.value)}
required

/>

<Input
icon={Lock}
type='password'
placeholder='Enter Password'
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<PasswordStrengthMeter password={password}/>

<motion.button
className='mt-5 w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all'
whileHover={{scale:1.02}}
whileTap={{scale:0.98}}
type='submit'
disabled={isLoading}
>
  {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> :"Sign Up"}
</motion.button>
</form>

  </div>

  <div className='px-8 py-4  flex justify-center h-[550px] w-[400px] mx-auto'>
  Already have a account?{" "}
  {/* <p className="text-green-400 hover:underline"> Login</p> /}
  {/ <Link className="text-green-400 hover:underline" href={"/"}>Login</Link> */}
  {!session && (
          <Link href={"/login"} className="text-green-300 hover:underline">
                Login    
          </Link>
        )}

</div>

  </motion.div>

   </>
  )
}

export default SignUpPage