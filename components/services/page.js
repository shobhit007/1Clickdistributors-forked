import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import DistributorView from "./distributor";
import ManufacturerView from "./manufacturer";
import panelContext from "@/lib/context/panelContext";
import moment from "moment";
import { MdClose } from "react-icons/md";

const page = () => {
  const [selectedTab, setSelectedTab] = useState("distributors");
  const { headerHeight } = useContext(panelContext);
  const [mainBoxHeight, setMainBoxHeight] = useState(null);
  const buttonDivRef = useRef(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [dateObjToSearch, setDateObjToSearch] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

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
    setSelectedRows([]);
  }, [selectedTab]);

  useEffect(() => {
    if (buttonDivRef.current && headerHeight) {
      let h =
        window.innerHeight -
        (buttonDivRef.current.offsetHeight + headerHeight) -
        6;
      setMainBoxHeight(h);
    }
  }, [buttonDivRef, headerHeight]);

  useEffect(() => {
    let start = moment()
      .startOf("day")
      .subtract({ days: 30 })
      .format("YYYY-MM-DD");
    let end = moment().endOf("day").format("YYYY-MM-DD");
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    setDateObjToSearch({
      selectedStartDate: start,
      selectedEndDate: end,
    });
  }, []);

  return (
    <div className="w-full flex flex-col px-1 py-[2px]">
      <div
        className="w-full flex gap-1 items-center flex-wrap md:flex-nowrap"
        ref={buttonDivRef}
      >
        {tabs.map((tab) => {
          return (
            <button
              className={`py-[1px] sm:py-[2px] text-nowrap px-1 sm:px-3 h-fit rounded ${
                selectedTab == tab.value
                  ? "bg-colorPrimary"
                  : "bg-colorPrimary/50"
              } text-white text-[10px] sm:text-sm font-semibold`}
              onClick={() => setSelectedTab(tab.value)}
            >
              {tab.tabName}
            </button>
          );
        })}
        {selectedTab && (
          <div className="flex gap-2 bg-gray-200 items-end py-[2px] px-3 rounded-md">
            <div className="flex flex-row items-center gap-1">
              <span className="text-[12px] text-gray-600">From</span>
              <input
                type="date"
                className="text-[11px] w-[90px] sm:w-auto border border-gray-600 rounded px-2"
                value={selectedStartDate}
                onChange={(e) => setSelectedStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="text-[12px] text-gray-600">To</span>
              <input
                type="date"
                className="text-[11px] border w-[90px] sm:w-auto border-gray-600 rounded px-2"
                value={selectedEndDate}
                onChange={(e) => setSelectedEndDate(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setDateObjToSearch({
                  selectedStartDate,
                  selectedEndDate,
                });
              }}
              className="text-white bg-blue-500 px-2 py-[2px] rounded-md text-xs"
            >
              Search
            </button>
          </div>
        )}
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="min-w-[80px]sm:min-w-[160px] border border-gray-400 outline-blue-500 sm:py-[2px] text-[10px] sm:text-[12px] px-2 rounded"
          placeholder="Enter to search table"
        />

        {selectedRows?.length > 0 && (
          <div className="py-[2px] px-1 sm:px-3 bg-blue-500/20 rounded text-blue-900 font-semibold flex gap-1 text-[10px] sm:text-sm items-center">
            selected {selectedRows?.length}
            <MdClose
              style={{ color: "blue", cursor: "pointer" }}
              className="text-[10px] sm:text-base"
              onClick={() => setSelectedRows([])}
            />
          </div>
        )}
      </div>

      <div
        style={{ height: mainBoxHeight || "auto" }}
        className={`w-full overflow-hidden`}
      >
        {selectedTab == "manufaturers" && (
          <ManufacturerView
            dateObjToSearch={dateObjToSearch}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        )}
        {selectedTab == "distributors" && (
          <DistributorView
            dateObjToSearch={dateObjToSearch}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        )}
      </div>
    </div>
  );
};

export default page;
