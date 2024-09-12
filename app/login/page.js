"use client";

import React, { useState } from "react";
import { Description, Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import CustomInput from "@/components/uiCompoents/CustomInput";
import { FaRegEyeSlash } from "react-icons/fa";
import {
  MdOutlineMailOutline,
  MdOutlinePassword,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { toast } from "react-toastify";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginUser = async () => {
    try {
      if (!email || email == "" || !password || password == "") {
        return toast.error("Please enter your email and password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex gap-2 justify-between min-h-[60vh] min-w-[50vw] bg-[#ff98500a] rounded-md shadow-lg shadow-gray-500/20">
        {/* login component */}
        <div className="flex flex-col items-center justify-center w-full md:w-[45%] bg-white p-5">
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

          <button onClick={loginUser} className="w-full bg-orange-700 text-white p-1 rounded-md mt-6">
            Login
          </button>
        </div>

        {/* image component */}
        <div className="flex flex-col justify-center p-8">
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
