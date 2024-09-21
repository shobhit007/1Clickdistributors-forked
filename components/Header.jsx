"use client";

import panelContext from "@/lib/context/panelContext";
import { logout } from "@/store/auth/authReducer";
import { authSelector } from "@/store/auth/selector";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./utills/Modal";
import UserDetailView from "./userDetailView";

const Header = () => {
  const { role } = useSelector(authSelector);
  const { displayComponent, ...body } = useContext(panelContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showUserDetailsPopup, setShowUserDetailsPopup] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="bg-gray-200 px-2 py-4 flex justify-between w-full items-center ">
      {showUserDetailsPopup && (
        <Modal>
          <div className="w-[95vw] md:[50vw] lg:[40vw] xl:w-[28vw] h-[70vh] p-2 bg-white relative rounded-md overflow-hidden">
            <button
              onClick={() => setShowUserDetailsPopup(false)}
              className="text-white bg-red-500 p-1 absolute top-0 right-0"
            >
              Close
            </button>

            <UserDetailView close={() => setShowUserDetailsPopup(false)} />
          </div>
        </Modal>
      )}

      {/* <img src="/logo.png" alt="logo" width={50} height={50} /> */}
      <div className="h-14 w-14 bg-colorPrimary rounded-full"></div>
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold capitalize">{role}</h1>

        <FaUser
          className="text-3xl text-gray-700"
          onClick={() => setShowUserDetailsPopup(true)}
        />
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
