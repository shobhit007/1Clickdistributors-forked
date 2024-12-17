import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import DistributorView from "./distributor";
import ManufacturerView from "./manufacturer";
import panelContext from "@/lib/context/panelContext";

const page = () => {
  const [selectedTab, setSelectedTab] = useState("distributors");
  const { headerHeight } = useContext(panelContext);
  const [mainBoxHeight, setMainBoxHeight] = useState(null);
  const buttonDivRef = useRef(null);
  const tabs = [
    {
      tabName: "My Brands",
      value: "distributors",
    },
    {
      tabName: "Manufaturers",
      value: "manufaturers",
    },
  ];

  useEffect(() => {
    if (buttonDivRef.current && headerHeight) {
      let h =
        window.innerHeight -
        (buttonDivRef.current.offsetHeight + headerHeight) -
        17;
      setMainBoxHeight(h);
    }
  }, [buttonDivRef, headerHeight]);

  return (
    <div className="w-full flex flex-col px-3 py-2">
      <div className="w-full flex gap-3" ref={buttonDivRef}>
        {tabs.map((tab) => {
          return (
            <button
              className={`py-1 px-3 rounded ${
                selectedTab == tab.value
                  ? "bg-colorPrimary"
                  : "bg-colorPrimary/50"
              } text-white text-sm font-semibold`}
              onClick={() => setSelectedTab(tab.value)}
            >
              {tab.tabName}
            </button>
          );
        })}
      </div>

      {console.log("mainBoxHeight", mainBoxHeight)}
      <div
        style={{ height: mainBoxHeight || "auto" }}
        className={`w-full p-2 overflow-hidden`}
      >
        {selectedTab == "manufaturers" && <ManufacturerView />}
        {selectedTab == "distributors" && <DistributorView />}
      </div>
    </div>
  );
};

export default page;
