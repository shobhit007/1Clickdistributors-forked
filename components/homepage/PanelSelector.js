import panelContext from "@/lib/context/panelContext";
import React, { useContext, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion"; // Import framer-motion

const PanelSelector = () => {
  const {
    userRoles,
    displayComponent,
    setDisplayComponent,
    setShowSidebar,
    showSidebar,
  } = useContext(panelContext);

  const formatString = (string) => {
    let arr = string?.split("_");
    return arr?.join(" ");
  };
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef?.current && !sidebarRef?.current?.contains(event.target)) {
        setShowSidebar(false);
        setTimeout(() => setShowSidebar(false), 300);
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSidebar]);

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "270px", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      ref={sidebarRef}
      className="h-[100vh] fixed z-50 top-0 left-0 flex flex-col bg-white shadow-md gap-2 py-2 scrollbar-thin"
    >
      <div className="flex flex-col relative gap-3 w-full px-2 pt-12">
        <button
          className="text-white text-3xl cursor-pointer absolute top-0 right-0 bg-red-500 py-1 px-2"
          onClick={() => setShowSidebar(false)}
        >
          <MdClose className="" />
        </button>
        {userRoles?.length > 0 ? (
          userRoles?.map((permission) => (
            <div
              key={permission} // Add key for better performance
              className={`h-auto py-3 px-2 w-full rounded-md cursor-pointer flex items-center ${
                displayComponent === permission
                  ? "bg-colorPrimary text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              onClick={() => {
                setDisplayComponent(permission);
                setShowSidebar(false);
                localStorage.setItem("currentDisplayComponent", permission);
              }}
            >
              <p className="text-sm font-semibold capitalize text-nowrap">
                {formatString(permission)}
              </p>
            </div>
          ))
        ) : (
          <div className="w-full h-auto">
            <p>You have no panels to access any panel</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PanelSelector;
