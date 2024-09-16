"use client";

import panelContext from "@/lib/context/panelContext";
import { logout } from "@/store/auth/authReducer";
import { authSelector } from "@/store/auth/selector";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const { role } = useSelector(authSelector);
  const { displayComponent, ...body } = useContext(panelContext);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="bg-gray-200 px-2 py-4 flex justify-between w-full items-center">
      {/* <img src="/logo.png" alt="logo" width={50} height={50} /> */}
      <div className="h-14 w-14 bg-colorPrimary rounded-full"></div>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold capitalize">{role}</h1>
        <button
          className="text-white bg-colorPrimary px-4 py-1 rounded-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
