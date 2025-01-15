"use client"
import Image from "next/image";
import Tea from "@/app/images/Tea2.gif";
import Man from "@/app/images/Man.gif";
import Coin from "@/app/images/Coin.gif";
import Fund2 from "@/app/images/Fund2.gif";
import { Route, Routes } from "react-router-dom";
// import page1 from "./signup/page";
// import page2 from "./login/page";
// import page3 from "./VerifyEmail/page"
// import page4 from "./forgotpassword/page"
// import page5 from "./reset-password/[token]/page"
import { useAuthStore } from "./store/authstore";
// import page6 from "./dashboard/page"
import LoadingSpinner from "./components/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { motion,AnimatePresence } from "framer-motion";
import { Coffee, Users, Wallet, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

// redirect authenticated user to home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/dashboard2" replace />;
  }
  return children;
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};



const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="bg-gray-800/20 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
    whileHover={{
      scale: 1.02,
      backgroundColor: "rgba(31, 41, 55, 0.3)",
      transition: { duration: 0.2 }
    }}
  >
    <div className="p-3 bg-purple-500/10 rounded-lg w-fit">
      <Icon className="w-6 h-6 text-purple-400" />
    </div>
    <h3 className="text-xl font-semibold text-white mt-4">{title}</h3>
    <p className="text-gray-400 mt-2">{description}</p>
  </motion.div>
);

const modalVariants = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};


const featureItems = [
  {
    title: "Creator-Centric",
    description: "Support your favorite creators directly with secure transactions",
    icon: "💫"
  },
  {
    title: "Global Platform",
    description: "Connect with supporters worldwide and grow your community",
    icon: "🌏"
  },
  {
    title: "Instant Rewards",
    description: "Offer exclusive content and perks to your supporters",
    icon: "🎁"
  },
  {
    title: "Zero Platform Fee",
    description: "Keep more of what you earn with minimal transaction fees",
    icon: "💰"
  }
];


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  console.log("isAuthenicated", isAuthenticated);
  console.log("user", user);

  
  return (
    <>
    {/* Section-1 */}
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="flex justify-center text-white min-h-[44vh] flex-col items-center gap-4 p-8"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div
          className="font-bold text-5xl flex gap-1 justify-center items-center mt-4 h-32"
          variants={fadeIn}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 h-36 mt-20">
          Fund My Chai
          </span>
          <motion.span
            whileHover={{ rotate: 10 }}
            className="inline-block"
          >
            <Image className="w-[12vw] h-[18vh]" src={Tea} alt="Tea cup" />
          </motion.span>
        </motion.div>

        <motion.p
          variants={fadeIn}
          className="text-gray-300 text-xl text-center max-w-2xl"
        >
          A crowdFunding Platform for creators, fund here and enjoy the Chai
        </motion.p>

        <motion.div
          className="buttons flex gap-4 mt-4"
          variants={fadeIn}
        >
          <Link href={"/signup"} >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all"
          >
         Start Here
          </motion.button></Link>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(75, 85, 99, 0.5)',
              borderColor: 'rgb(147, 51, 234)'
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-3 bg-gray-800/50 rounded-lg font-medium text-white border border-gray-700 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Read More</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="absolute inset-0 border border-purple-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 "
            />
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed top-[20px] left-[350px] transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 z-50 shadow-2xl"
            >
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute  -right-2 w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  ×
                </button>
                
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                  About Fund My Chai
                </h2>
                
                <p className="text-gray-300 mb-6">
                  Welcome to the future of creator support! Fund My Chai is a revolutionary crowdfunding platform that connects creators with their supporters through the warm gesture of sharing a virtual chai.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {featureItems.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                    >
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
                  <h3 className="text-white font-semibold mb-2">Why Choose Fund My Chai?</h3>
                  <p className="text-gray-300 text-sm">
                    Our platform offers a unique blend of community support and creator empowerment. With seamless transactions, global reach, and instant rewards, we make it easy for creators to monetize their passion while building meaningful connections with their supporters.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      


      {/* <div className="bg-white opacity-10 h-1"></div> */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent my-12" />


  
      <div className="py-16 relative overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <motion.div
        className="max-w-6xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Fund My {" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Chai
            </span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Support your favorite creators with a virtual chai. A simple way to show appreciation
            and help them continue creating amazing content.
          </p>
        </motion.div>


        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={Coffee}
              title="Buy a Virtual Chai"
              description="Show appreciation by treating your favorite creators to a virtual chai. Every cup counts!"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={Wallet}
              title="Secure Transactions"
              description="Safe and transparent payment processing with instant notifications and tracking."
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={Users}
              title="Build Community"
              description="Connect with creators and other supporters in a vibrant, growing community."
            />
          </motion.div>
        </motion.div>

        {/* CTA Button */}
      
      </motion.div>
    </div>    
       
      
    {/* </div> */}


        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <page6 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <page1 />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <page2 />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<page3 />} />

          <Route path="/forgot-password" element={
            <RedirectAuthenticatedUser>
<page4/>
            </RedirectAuthenticatedUser>
            } />

<Route path="/reset-password/:token" element={
            <RedirectAuthenticatedUser>
<page5/>
            </RedirectAuthenticatedUser>
            } />
        </Routes>
      </div>
    </>
  );
}
