import panelContext from "@/lib/context/panelContext";
import React, { useContext, useEffect } from "react";

const PanelSelector = () => {
  const { userRoles, displayComponent, setDisplayComponent } =
    useContext(panelContext);

  const formatString = (string) => {
    let arr = string?.split("_");
    return arr?.join(" ");
  };

  return (
    <div className="w-full h-auto overflow-x-auto flex gap-2 my-2 px-2 py-2 scrollbar-thin">
      {userRoles?.length > 0 ? (
        userRoles?.map((permission) => (
          <div
            className={`w-fit h-auto py-[2px] px-2 rounded-md cursor-pointer flex items-center ${
              displayComponent === permission
                ? "bg-colorPrimary"
                : "bg-gray-500"
            }`}
            onClick={() => {
              setDisplayComponent(permission);
              localStorage.setItem("currentDisplayComponent", permission);
            }}
          >
            <p className="text-sm font-semibold text-white capitalize text-nowrap">
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
  );
};

export default PanelSelector;
