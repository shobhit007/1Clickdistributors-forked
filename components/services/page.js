import React, { useState } from "react";
import DistributorView from "./distributor";
import ManufacturerView from "./manufacturer";

const page = () => {
  const [selectedTab, setSelectedTab] = useState("distributors");
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
  return (
    <div className="w-full h-full flex flex-1 flex-col px-3 py-2">
      <div className="w-full flex gap-3">
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

      <div className="w-full">
        {selectedTab == "manufaturers" && <ManufacturerView />}
        {selectedTab == "distributors" && <DistributorView />}
      </div>
    </div>
  );
};

export default page;
