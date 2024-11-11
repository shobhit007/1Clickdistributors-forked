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
import { useQueryClient } from "@tanstack/react-query";
import { RiMenu2Fill } from "react-icons/ri";
import Image from "next/image";

const Header = () => {
  const queryClient = useQueryClient();
  const { role } = useSelector(authSelector);
  const {
    displayComponent,
    userDetails,
    setDisplayComponent,
    setPreviousComponent,
    setShowSidebar,
    showSidebar,
  } = useContext(panelContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showUserDetailsPopup, setShowUserDetailsPopup] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
    dispatch(logout());
    router.replace("/login");
  };

  const showGlobalSearch = () => {
    setPreviousComponent(displayComponent);
    setDisplayComponent("globalSearch");
  };

  return (
    <div className="bg-gray-200 px-2 py-1 md:py-1 flex justify-between w-full items-center ">
      {showUserDetailsPopup && (
        <Modal>
          <div className="w-[95vw] md:[50vw] lg:[40vw] xl:w-[28vw] h-[85vh] p-2 bg-white relative rounded-md overflow-hidden">
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

      <div className="flex items-center gap-3">
        <RiMenu2Fill
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-[28px] text-gray-600 cursor-pointer"
        />
        <img src="/1Click_Logo_v1.png" alt="logo" className="h-[40px] w-auto select-none" />
        {/* <div className="h-8 md:h-14 w-8 md:w-14 bg-colorPrimary rounded-full"></div> */}
      </div>

      <div className="flex items-center gap-4">
        <MdSearch
          onClick={showGlobalSearch}
          className="text-3xl text-gray-700 font-bold cursor-pointer"
        />

        {/* <div className="hidden md:flex flex-col">
          <h1 className="text-sm font-semibold capitalize">
            Welcome {userDetails?.name}
          </h1>
          {userDetails?.hierarchy && (
            <h1 className="text-sm text-gray-500 capitalize">
              ({userDetails?.hierarchy})
            </h1>
          )}
        </div> */}

        <div className="flex items-center gap-1">
          {userDetails?.userImageLink ? (
            <button
              className="outline-none"
              onClick={() => setShowUserDetailsPopup(true)}
            >
              <img
                src={userDetails?.userImageLink}
                className="rounded-full h-[45px] w-[45px] object-cover"
              />
            </button>
          ) : (
            <FaUser
              className="text-xl md:text-xl text-gray-700 cursor-pointer"
              onClick={() => setShowUserDetailsPopup(true)}
            />
          )}
        </div>
        <button
          className="text-white text-sm bg-colorPrimary px-4 hidden md:flex items-center gap-2 py-[2px] rounded-md"
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
