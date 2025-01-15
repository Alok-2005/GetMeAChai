"use client"
import React, { useEffect } from 'react'
import { useSession,signIn,signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateProfile } from '../actions/serveractions'
import { fetchuser } from '../actions/serveractions'

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { Slide } from "react-toastify";

const Dashboard = () => {
  const {data:session,update}=useSession()
  const router=useRouter()
const [form, setform] = useState({})
useEffect(() => {
 if(!session){
  router.push('/login')
 }else{
  getData()

 }
}, [router,session])

const getData=async()=>{
let u=await fetchuser(session.user.name)
setform(u)
}

const handleChange=(e)=>{
  setform({...form,[e.target.name]:e.target.value})
}
 
const handlesubmit=async(e)=>{
  let a=await updateProfile(e,session.user.name)
  toast.success('Profile updated sucessfully', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Slide,
    });

// alert("Profile updated")
}
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
theme="dark"
/>

   <form action={handlesubmit}>
  
    
<div className="form flex flex-col items-center  gap-2 pb-14">
<h2 className='text-center font-bold text-3xl my-4 '>Welcome to your Dashboard</h2>


<h3 className='mr-[550px]'>Name</h3>
{/* if you want to name also on refresh then do this   */}
<input value={form.name?form.name:""} onChange={handleChange} name='name' id='name' type="text" className='w-[600px] rounded-lg bg-slate-800 p-2' required /> 

{/* <input  name='name' id='name' type="text" className='w-[600px] rounded-lg bg-slate-800 p-2' required /> */}

<h3 className='mr-[550px]'>Email</h3>
<input value={form.email?form.email:""} onChange={handleChange} name='email' id='email' type="text" className='w-[600px] rounded-lg bg-slate-800 p-2' required />

<h3 className='mr-[520px]'>Username</h3>
<input value={form.username?form.username:""} onChange={handleChange} name='username' id='username' type="text" className='w-[600px] rounded-lg bg-slate-800 p-2' required/>

<h3 className='mr-[500px]'>Profile Picture</h3>
<input value={form.profilepic?form.profilepic:""} onChange={handleChange} name='profilepic' id='profilepic'  className='w-[600px] rounded-lg bg-slate-800 p-2' required/>

<h3 className='mr-[500px]'>Cover Picture</h3>
<input value={form.coverpic?form.coverpic:""} onChange={handleChange} name='coverpic' id='coverpic'  className='w-[600px] rounded-lg bg-slate-800 p-2' required/>

<h3 className='mr-[510px]'>RazorPay ID</h3>
<input value={form.razorpayid?form.razorpayid:""} onChange={handleChange} name='razorpayid' id='razorpayid' type="text" className='w-[600px] rounded-lg bg-slate-800 p-2'required />

<h3 className='mr-[480px]'>RazorPay Secret</h3>
<input value={form.razorpaysecret?form.razorpaysecret:""} onChange={handleChange} name='razorpaysecret' id='razorpaysecret' type="text" className='w-[600px] rounded-lg bg-slate-800 p-2'required />

<button onChange={handlesubmit} type="submit" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Submit</button>

</div>


   </form>
   </>
  )
}

export default Dashboard
