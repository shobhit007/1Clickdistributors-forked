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
import { GrLogout } from "react-icons/gr";
import { MdSearch } from "react-icons/md";

const Header = () => {
  const { role } = useSelector(authSelector);
  const {
    displayComponent,
    userDetails,
    setDisplayComponent,
    setPreviousComponent,
  } = useContext(panelContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showUserDetailsPopup, setShowUserDetailsPopup] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    router.replace("/login");
  };

  const showGlobalSearch = () => {
    setPreviousComponent(displayComponent);
    setDisplayComponent("globalSearch");
  };

  return (
    <div className="bg-gray-200 px-2 py-1 md:py-4 flex justify-between w-full items-center ">
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
      <div className="h-8 md:h-14 w-8 md:w-14 bg-colorPrimary rounded-full"></div>
      <div className="flex items-center gap-4">
        <MdSearch
          onClick={showGlobalSearch}
          className="text-3xl text-gray-700 font-bold cursor-pointer"
        />

        <div className="hidden md:flex flex-col">
          <h1 className="text-base font-semibold capitalize">
            Welcome, {userDetails?.name}
          </h1>
          <h1 className="text-sm text-gray-500 capitalize">
            ({userDetails?.role})
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <FaUser
            className="text-xl md:text-2xl text-gray-700 cursor-pointer"
            onClick={() => setShowUserDetailsPopup(true)}
          />
        </div>
        <button
          className="text-white bg-colorPrimary px-4 hidden md:flex items-center gap-2 py-1 rounded-md"
          onClick={handleLogout}
        >
          Logout
          <GrLogout className="text-white text-sm" />
        </button>
        <GrLogout
          onClick={handleLogout}
          className="text-gray-800 text-xl md:hidden"
        />
      </div>
    </div>
  );
};

export default Header;
