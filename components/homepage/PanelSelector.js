import panelContext from "@/lib/context/panelContext";
import React, { useContext, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion"; // Import framer-motion
import { MdHowToVote } from "react-icons/md";
import { LuLayoutPanelTop } from "react-icons/lu";
import { FaUsersRays } from "react-icons/fa6";
import { GiSettingsKnobs } from "react-icons/gi";
import { RxDashboard } from "react-icons/rx";
import { RiListSettingsFill } from "react-icons/ri";
import { panelNames } from "@/lib/data/commonData";
import { FaChartBar } from "react-icons/fa";


const getIcons = (panelName, selected) => {
  console.log("panel name is", panelName);
  let d6521f = { color: selected ? "#fff" : "#d6521f", fontSize: 22 };
  switch (panelName) {
    case "allocate_leads":
      return <MdHowToVote style={d6521f} />;
    case "sales_panel":
      return <FaChartBar style={d6521f} />;
    case "manage_users":
      return <FaUsersRays style={d6521f} />;
    case "roles_and_permissions":
      return <GiSettingsKnobs style={d6521f} />;
    case "dashboard":
      return <RxDashboard style={d6521f} />;
    case "panel_settings":
      return <RiListSettingsFill style={d6521f} />;
    default:
      break;
  }
};

const PanelSelector = () => {
  const {
    userRoles,
    displayComponent,
    setDisplayComponent,
    setShowSidebar,
    showSidebar,
  } = useContext(panelContext);

  const formatString = (string) => {
    let name = panelNames[string];

    if (name) {
      return name;
    }

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
      animate={{ width: "300px", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      ref={sidebarRef}
      className="h-[100vh] fixed z-50 top-0 left-0 flex flex-col bg-white shadow-md gap-2 py-2 scrollbar-thin"
    >
      <div className="flex flex-col relative w-full pt-12">
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
              className={`h-auto py-3 px-2 w-full border-b border-gray-300 cursor-pointer flex items-center gap-4 ${
                displayComponent === permission
                  ? "bg-colorPrimary text-white"
                  : " text-gray-600 hover:bg-gray-300"
              }`}
              onClick={() => {
                setDisplayComponent(permission);
                setShowSidebar(false);
                localStorage.setItem("currentDisplayComponent", permission);
              }}
            >
              {getIcons(permission, displayComponent === permission)}
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

      <div className="absolute bottom-0 w-full flex items-center justify-center pb-3">
        <img src="/flatLogo.png" className="w-[250px] h-auto" />
      </div>
    </motion.div>
  );
};

export default PanelSelector;
