import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/app/models/Payment";
import Razorpay from "razorpay";
import connectDb from "@/app/db/connectDb";
import User from "@/app/models/User";

export const POST=async(req)=>{
    await connectDb()
let body=await req.formData()
body=Object.fromEntries(body)

let a=await Payment.findOne({oid:body.razorpay_order_id})
if(!a){
    return NextResponse.json({success:false,message:"order id not found"})
}
// fetch the secret of the user who is getting payment
let user=await User.findOne({username:a.to_user})
const secret=user.razorpaysecret

let aa=validatePaymentVerification({"order_id":body.razorpay_order_id,"payment_id":body.razorpay_payment_id}, body.razorpay_signature,secret)

if(aa){
    const updatedPayment=await Payment.findOneAndUpdate({oid:body.razorpay_order_id},{done:"true"},{new:true})
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`)

}else{
   return NextResponse.json({success:false,message:"Payment verification Failed"}) 
}
}