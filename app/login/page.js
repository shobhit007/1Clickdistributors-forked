"use client";

import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import {
  MdOutlineMailOutline,
  MdOutlinePassword,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { login } from "@/store/auth/authReducer";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const loginUser = async () => {
    try {
      if (!email || email == "" || !password || password == "") {
        return toast.error("Please enter your email and password");
      }

      setLoading(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/login`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      // console.log("data on login is", data);
      if (data.success && data.token) {
        dispatch(login({ email, token: data.token, role: data.role }));
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", email);
        router.push("/panel");
      } else {
        return toast.error(data.message);
      }
      toast.success(data.message);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-[98vw] h-[100vh] flex items-center justify-center">
      <div className="flex gap-2 justify-between  min-h-[60vh] min-w-[50vw] bg-[#ff98500a] rounded-md md:shadow-lg shadow-gray-500/20">
        {/* login component */}

        <div className="flex flex-col items-center justify-center w-[90vw] md:w-[45%] bg-white p-5">
          {/* Logo section */}
          <div className="w-full p-4 flex md:hidden justify-center">
            <div className="h-[180px] w-[180px] rounded-full bg-blue-500"></div>
          </div>

          <div className="flex flex-col w-full gap-1">
            <span className="text-slate-600 font-semibold text-base flex items-center gap-1">
              <MdOutlineMailOutline />
              Enter your email
            </span>
            <input
              type="email"
              required={true}
              className="w-full rounded-md border border-gray-300 p-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-1 mt-3">
            <span className="text-slate-600 font-semibold text-base flex items-center gap-1">
              <MdOutlinePassword /> Enter your password
            </span>
            <div className="flex justify-between items-center border border-gray-300 p-1 rounded-md">
              <input
                type={showPassword ? "text" : "password"}
                required={true}
                className="rounded-md flex flex-1 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <FaRegEyeSlash
                  onClick={() => setShowPassword(false)}
                  className="text-slate-600 cursor-pointer"
                />
              ) : (
                <MdOutlineRemoveRedEye
                  onClick={() => setShowPassword(true)}
                  className="text-slate-600 cursor-pointer"
                />
              )}
            </div>
          </div>

          <button
            onClick={loginUser}
            disabled={loading}
            className={`w-full bg-colorPrimary disabled:bg-colorPrimary/50 text-white p-1 rounded-md mt-6 ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* image component */}
        <div className="hidden md:flex flex-col justify-center p-8">
          <h1 className="text-slate-700 font-bold text-2xl">
            1Clickdistributors Panel Login
          </h1>
          <p className="text-slate-500 text-base">
            Enter your login credentials to access your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
