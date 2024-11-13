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
import { useDispatch } from "react-redux";
import { login } from "@/store/auth/authReducer";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const getLoginPageImage = async () => {
    try {
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/panel/getLoginPageImageLink`;
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        return data.link;
      } else {
        return null;
      }
    } catch (error) {
      toast.error("Error in getting image link");
    }
  };

  const {
    data: loginPageImage,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["loginPageImage"],
    queryFn: getLoginPageImage,
  });

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
        queryClient.invalidateQueries();
        dispatch(
          login({ email, token: data.token, hierarchy: data.hierarchy })
        );
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("email", email);
        router.replace("/board");
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
      <div className="imgComponent hidden sm:flex items-center justify-center sm:w-[70%] h-full bg-gray-200">
        {!isLoading && (
          <img
            src={loginPageImage || "/loginbg.jpg"}
            className="w-full h-full bg-cover bg-center"
          />
        )}
      </div>

      <div className="flex relative flex-col justify-center h-full items-center w-full sm:w-[30%] rounded-md ">
        {/* login component */}
        {/* Logo section */}
        <div className="w-full p-4 absolute left-0 top-4 flex justify-start">
          {/* <div className="h-[180px] w-[180px] rounded-full bg-blue-500"></div> */}
          <img
            src="/expendico.png"
            className="w-[180px] h-auto object-contain filter"
          />
        </div>

        <div className="flex relative flex-col items-center justify-center w-full bg-white p-5">
          <h2 className="text-lg md:text-2xl text-gray-800 font-bold">
            Welcome to 1Clickdistributors
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-semibold">
            Today is your best Day
          </p>

          <form action={"#"} className="w-full mt-4 md:mt-12">
            <div className="flex flex-col w-full gap-1">
              <span className="text-slate-600 font-semibold text-base flex items-center gap-1">
                <MdOutlineMailOutline />
                Enter your email
              </span>
              <input
                type="email"
                placeholder="Enter Email"
                name="current-password"
                autocomplete="current-password"
                required={true}
                className="w-full p-1 bg-gray-200 border-b-2 border-b-gray-300 focus:outline-none focus:border-b-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-1 mt-3">
              <span className="text-slate-600 font-semibold text-base flex items-center gap-1">
                <MdOutlinePassword /> Enter your password
              </span>
              <div className="flex justify-between items-center  bg-gray-200">
                <input
                  type={showPassword ? "text" : "password"}
                  required={true}
                  name="password"
                  placeholder="Enter Password"
                  autocomplete="password"
                  className="flex flex-1 bg-transparent p-1 border-b-2 border-b-gray-300 focus:outline-none focus:border-b-blue-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <FaRegEyeSlash
                    onClick={() => setShowPassword(false)}
                    className="text-slate-600 cursor-pointer mr-2"
                  />
                ) : (
                  <MdOutlineRemoveRedEye
                    onClick={() => setShowPassword(true)}
                    className="text-slate-600 cursor-pointer mr-2"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              onClick={loginUser}
              disabled={loading}
              className={`w-full bg-colorPrimary disabled:bg-colorPrimary/50 text-white p-1 rounded-md mt-6 ${
                loading ? "animate-pulse" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <Link
            href={`/reset-password`}
            className="hover:underline text-colorPrimary/70 mt-4 text-left"
          >
            Forgot Password? Click to recover
          </Link>
        </div>

        {/* image component */}
        {/* <div className="hidden md:flex flex-col justify-center p-8">
          <h1 className="text-slate-700 font-bold text-2xl">
            1Clickdistributors Panel Login
          </h1>
          <p className="text-slate-500 text-base">
            Enter your login credentials to access your account
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default page;
