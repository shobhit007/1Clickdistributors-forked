import manufacturerContext from "@/lib/context/manufacturerContext";
import Image from "next/image";
import React, { useContext } from "react";
import { FaPhone, FaRegUser, FaWhatsapp } from "react-icons/fa6";
import { RxDashboard, RxHamburgerMenu } from "react-icons/rx";
import Tooltip from "@mui/material/Tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdCopyAll, MdEmail } from "react-icons/md";
import { copyToClipboard } from "@/lib/commonFunctions";

const Header = () => {
  const { userDetails, setShowSidebar } = useContext(manufacturerContext);
  console.log("user details", userDetails);

  return (
    <div className="w-full flex justify-between  px-4 py-1 items-center">
      <div className="flex items-center gap-2 overflow-hidden">
        <button onClick={() => setShowSidebar(true)} className="lg:hidden">
          <RxHamburgerMenu className="text-orange-800 text-2xl" />
        </button>
        <Image
          src={"/flatLogo.png"}
          height={40}
          width={150}
          objectFit="cover"
          className="rounded-full shdadow"
        />
      </div>

      <div className="flex items-center gap-5">
        {userDetails?.serviceExecutiveName && (
          <Popover>
            <PopoverTrigger asChild>
              <div
                // href={`tel:${userDetails?.serviceExecutivePhone}`}
                className="cursor-pointer flex gap-2 px-3 py-[2px] items-center bg-gray-500/20 rounded-full "
              >
                <img
                  className="h-10 w-10 object-cover rounded-full"
                  src={userDetails?.serviceExecutiveImage}
                />

                <div className="flex flex-col gap-[2px]">
                  <div className="flex items-center gap-1">
                    <FaRegUser className="text-gray-700 text-xs" />
                    <h1 className="text-xs font-semibold text-gray-600">
                      {userDetails?.serviceExecutiveName}
                    </h1>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <h1 className=" text-gray-600">Your POC details</h1>
                  </div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full bg-[#0b0c3a] p-3 flex flex-col gap-1">
              <h1 className="text-base font-semibold text-white">
                Hi, I am {userDetails?.serviceExecutiveName}, Your POC
              </h1>

              <div
                className="flex gap-2 items-center text-gray-200 mt-2"
                onClick={() => console.log("userDetails", userDetails)}
              >
                <MdEmail className="text-orange-500 text-base" />
                <span className="">{userDetails?.serviceExecutiveEmail}</span>
                <MdCopyAll
                  className="text-gray-200 text-lg ml-1 cursor-pointer"
                  onClick={() => {
                    copyToClipboard(userDetails?.serviceExecutiveEmail);
                  }}
                />
              </div>
              <div
                className="flex gap-2 items-center text-gray-200 mt-1"
                onClick={() => console.log("userDetails", userDetails)}
              >
                <FaPhone className="text-orange-500 text-base" />
                <span className="">{userDetails?.serviceExecutivePhone}</span>
                <MdCopyAll
                  className="text-gray-200 text-lg ml-1 cursor-pointer"
                  onClick={() => {
                    copyToClipboard(userDetails?.serviceExecutivePhone);
                  }}
                />
              </div>

              <div className="flex gap-3 mt-4 items-center">
                <a
                  href={`tel:${userDetails?.serviceExecutivePhone}`}
                  className="bg-colorPrimary py-1 px-2 flex items-center text-white gap-2 rounded-md"
                >
                  <FaPhone className="text-sm" />
                  <span>Call now</span>
                </a>
                <button
                  className="bg-transparent border border-white rounded-md py-1 px-2 flex items-center gap-2 text-white hover:bg-white/40"
                  onClick={() => {
                    window.open(
                      `https://wa.me/${userDetails?.serviceExecutivePhone}`,
                      "_blank"
                    );
                  }}
                >
                  <FaWhatsapp className="text-lg text-green-500" />
                  <span>Whatsapp</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <div className="hidden md:flex flex-row text-xs items-start font-semibold text-slate-600 mr-6 gap-1 bg-gray-500/20 px-3 py-[2px] rounded-full">
          {userDetails?.profileImageURL && (
            // <Image
            //   src={userDetails?.profileImageURL}
            //   height={40}
            //   width={40}
            //   objectFit="cover"
            //   className="rounded-full shdadow-lg"
            // />
            <img
              className="h-10 w-10 object-cover rounded-full"
              src={userDetails?.profileImageURL}
            />
          )}
          <div className="flex flex-col">
            <span className="">Hi Welcome</span>
            <span className="-mt-[2px] font-bold capitalize text-slate-800 text-sm">
              {userDetails?.full_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
