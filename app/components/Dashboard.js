"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateProfile, fetchuser } from "../actions/serveractions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({});

  const getData = useCallback(async () => {
    let u = await fetchuser(session?.user?.name);
    setForm(u);
  }, [session?.user?.name]);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      getData();
    }
  }, [router, session, getData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(form, session?.user?.name);
    toast.success("Profile updated successfully", {
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
  };

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
      <form onSubmit={handleSubmit}>
        <div className="form flex flex-col items-center gap-2 pb-14">
          <h2 className="text-center font-bold text-3xl my-4">
            Welcome to your Dashboard
          </h2>
          <h3 className="mr-[550px]">Name</h3>
          <input
            value={form.name || ""}
            onChange={handleChange}
            name="name"
            id="name"
            type="text"
            className="w-[600px] rounded-lg bg-slate-800 p-2"
            required
          />
          <h3 className="mr-[550px]">Email</h3>
          <input
            value={form.email || ""}
            onChange={handleChange}
            name="email"
            id="email"
            type="text"
            className="w-[600px] rounded-lg bg-slate-800 p-2"
            required
          />
          <h3 className="mr-[520px]">Username</h3>
          <input
            value={form.username || ""}
            onChange={handleChange}
            name="username"
            id="username"
            type="text"
            className="w-[600px] rounded-lg bg-slate-800 p-2"
            required
          />
          <h3 className="mr-[500px]">Profile Picture</h3>
          <input
            value={form.profilepic || ""}
            onChange={handleChange}
            name="profilepic"
            id="profilepic"
            className="w-[600px] rounded-lg bg-slate-800 p-2"
            required
          />
          <h3 className="mr-[500px]">Cover Picture</h3>
          <input
            value={form.coverpic || ""}
            onChange={handleChange}
            name="coverpic"
            id="coverpic"
            className="w-[600px] rounded-lg bg-slate-800 p-2"
            required
          />
          <h3 className="mr-[510px]">RazorPay ID</h3>
          <input
            value={form.razorpayid || ""}
            onChange={handleChange}
            name="razorpayid"
            id="razorpayid"
            type="text"
            className="w-[600px] rounded-lg bg-slate-800 p-2"
            required
          />
          <h3 className="mr-[480px]">RazorPay Secret</h3>
          <input
            value={form.razorpaysecret || ""}
            onChange={handleChange}
            name="razorpaysecret"
            id="razorpaysecret"
            type="text"
            className="w-[600px] rounded-lg bg-slate-800 p-2"
            required
          />
          <button
            type="submit"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default Dashboard;