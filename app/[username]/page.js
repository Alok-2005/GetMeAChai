import React from 'react'
import PaymentPage from '../components/PaymentPage'
<<<<<<< HEAD
import { notFound } from "next/navigation"
import connectDb from '../db/connectDb'
import User from '../models/User'
const Username = async ({ params }) => {

  // If the username is not present in the database, show a 404 page
  const checkUser = async () => {
    await connectDb()
    let u = await User.findOne({ username: params.username })
    if (!u) {
      return notFound()
=======
import { notFound } from "next/navigation";
import connectDb from '../db/connectDb';
import User from '../models/User';

export const dynamic = 'force-dynamic'

const Username = async ({ params }) => {
  try {
    const connected = await connectDb();
    if (!connected) {
      throw new Error('Failed to connect to database');
>>>>>>> 988f7421e85157d26bd31e3768d7f975eaa0100b
    }

    const user = await User.findOne({ username: params.username });
    
    if (!user) {
      return notFound();
    }

    return (
      <div className="container mx-auto">
        <PaymentPage username={params.username} />
      </div>
    );
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
<<<<<<< HEAD
  await checkUser()



  return (
    <>
      <PaymentPage username={params.username} />
    </>
  )
}

export default Username
 
export async function generateMetadata({ params }) {
  return {
    title: `Support ${params.username} - Get Me A Chai`,
  }
}
=======
}

export default Username;
>>>>>>> 988f7421e85157d26bd31e3768d7f975eaa0100b
