import localFont from "next/font/local";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import "./globals.css"
import SessionWrapper from "./components/SessionWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
        <SessionWrapper>
          <Navbar/>
          <div className="min-h-[555px] text-white">
            {children}
          </div>
          <Toaster />
          <Footer/>
        </SessionWrapper>
      </body>
    </html>
  );
}