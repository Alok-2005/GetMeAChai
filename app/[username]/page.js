import React from 'react'
import PaymentPage from '../components/PaymentPage'
import { notFound } from "next/navigation";
import connectDb from '../db/connectDb';
import User from '../models/User';

export const dynamic = 'force-dynamic'

const Username = async ({ params }) => {
  try {
    await connectDb();
    const user = await User.findOne({ username: params.username });
    
    if (!user) {
      return notFound();
    }

    return (
      <PaymentPage username={params.username} />
    );
  } catch (error) {
    console.error('Error:', error);
    return notFound();
  }
}

export default Username;