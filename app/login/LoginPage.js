import React, { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Input from "./Input";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { Loader } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard'  // Specify where to redirect after successful login
      });

      if (result?.error) {
        toast.error(result.error || "Invalid credentials");
      } else {
        toast.success("Logged in successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  if (session) {
    return null; // Don't render the login form if already logged in
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl shadow-xl overflow-hidden h-[550px] w-[800px]"
    >
      <div className="mx-60 mt-20">
        <h2 className="text-3xl font-bold mb-5 text-center bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            icon={Lock}
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center mb-6">
            <Link
              href="/forgotpassword"
              className="text-sm text-green-300 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* Optional: Add GitHub login as a separate button if needed */}
        {/* <button
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          className="mt-4 w-full py-3 bg-gray-800 text-white rounded-lg"
        >
          Login with GitHub
        </button> */}
      </div>

      <div className="px-8 py-4 flex justify-center mx-auto">
        Don't have an account?{" "}
        <Link href="/signup" className="text-green-300 hover:underline ml-1">
          Signup
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginPage;