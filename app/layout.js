"use client"
import localFont from "next/font/local";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import "./globals.css"
import SessionWrapper from "./components/SessionWrapper";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router-dom";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});`1q`
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "Get Me A Chai-Fund Your Projects",
//   description: "This website is for Chai lovers",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className="bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" 
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900"
      >
         <Router>
        <SessionWrapper>
        <Navbar/>
        <div className="min-h-[555px]  text-white">
        {children}
        </div>
        <Toaster />

        <Footer/>
        </SessionWrapper>
  </Router>

      </body>
    </html>
  );
}
