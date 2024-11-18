"use client";

import panelContext from "@/lib/context/panelContext";
import { logout } from "@/store/auth/authReducer";
import { authSelector } from "@/store/auth/selector";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./utills/Modal";
import UserDetailView from "./userDetailView";
import { GrLogout } from "react-icons/gr";
import { MdSearch } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import { RiMenu2Fill } from "react-icons/ri";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";

const Header = () => {
  const queryClient = useQueryClient();
  const { role } = useSelector(authSelector);
  const headerRef = useRef(null);
  const {
    displayComponent,
    userDetails,
    setDisplayComponent,
    setPreviousComponent,
    setShowSidebar,
    showSidebar,
    setHeaderHeight,
  } = useContext(panelContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showUserDetailsPopup, setShowUserDetailsPopup] = useState(false);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [headerRef]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    dispatch({ type: "LOGOUT" });
    dispatch(logout());
    router.replace("/login");
  };

  const showGlobalSearch = () => {
    setPreviousComponent(displayComponent);
    setDisplayComponent("globalSearch");
  };

  const refreshPanel = () => {
    queryClient.invalidateQueries();
    setDisplayComponent("dashboard");
  };

  return (
    <div
      ref={headerRef}
      className="bg-[#e0f0fb] px-2 py-1 md:py-1 flex justify-between w-full items-center "
    >
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

      <div className="flex items-center gap-1">
        <button className="p-1 bg-white/30 rounded-md">
          <IoIosArrowForward
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-gray-600 cursor-pointer"
            fontSize={22}
          />
        </button>
        <button onClick={refreshPanel}>
          <img
            src="/flatLogo.png"
            alt="logo"
            className="h-[30px] w-auto select-none"
          />
        </button>
        {/* <div className="h-8 md:h-14 w-8 md:w-14 bg-colorPrimary rounded-full"></div> */}
      </div>

      <div className="flex items-center gap-4">
        <MdSearch
          onClick={showGlobalSearch}
          className="text-gray-600 cursor-pointer"
          style={{ fontSize: 22 }}
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
                className="rounded-full h-8 w-8 object-cover"
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
          className="text-white text-xs bg-colorPrimary px-4 hidden md:flex items-center gap-2 py-[3px] rounded-md"
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
