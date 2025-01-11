import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import { cellColors } from "@/lib/data/commonData";

/*
"Not Open": 0,
    Today_Followup: 0,
    "Call Back": 0,
    Presentation_Followup: 0,
    Presentation: 0,
    Prospect: 0,
    Prospect_Followup: 0,
    Deal_Done: 0,
    "Not Interested": 0,
  }
*/

const Filters = ({
  setLeads,
  originalData,
  userDetails: currentUser,
  setMyData,
  myData,
  isSalesPanel,
  selectedServiceMembers,
}) => {
  const [selectedDisposition, setSelectedDisposition] = useState([]);
  const [selectedSubDisposition, setSelectedSubDisposition] = useState([]);
  const [unallocatedLeadsCount, setUnallocatedLeadsCount] = useState(null);
  const [filters, setFilters] = useState({
    unAllocated: false,
    salesMembers: [],
    btnFilter: null,
  });
  const [list, setList] = useState({
    salesMembers: [],
  });

  const [dispositionData, setDispositionData] = useState(null);
  const currentLoggedInUser = currentUser?.userDetails;

  useEffect(() => {
    if (selectedServiceMembers) {
      setFilters((pre) => ({ ...pre, salesMembers: selectedServiceMembers }));
    }
  }, [selectedServiceMembers]);

  useEffect(() => {
    if (!originalData) {
      return;
    }
    let salesMembers = {};
    let unallocatedLeads = 0;
    let filteredDispositionData = {
      "Not Open": 0,
      Today_Followup: 0,
      "Call Back": 0,
      Presentation: 0,
      Prospect: 0,
      "Deal Done": 0,
      "Not Interested": 0,
    };
    let filteredSubDispositionData = {
      "Prospect-Followup": 0,
      "Presentation-Followup": 0,
      "Payment-Followup": 0,
    };
    originalData?.forEach((lead) => {
      if (!lead.salesExecutive) {
        unallocatedLeads++;
      }

      if (lead?.salesExecutive && !salesMembers[lead?.salesExecutive]) {
        salesMembers[lead?.salesExecutive] = {
          label: lead.salesExecutiveName,
          value: lead.salesExecutive,
        };
      }

      if (
        lead.disposition &&
        filteredDispositionData.hasOwnProperty(lead.disposition)
      ) {
        filteredDispositionData[lead.disposition]++;
      }

      if (
        lead.subDisposition &&
        filteredSubDispositionData.hasOwnProperty(lead.subDisposition)
      ) {
        filteredSubDispositionData[lead.subDisposition]++;
      }

      if (lead?.followUpDate) {
        let followupdate = new Date(lead.followUpDate?._seconds * 1000);
        if (moment(followupdate).isSame(moment(), "date")) {
          filteredDispositionData.Today_Followup++;
        }
      }
    });

    setDispositionData({
      ...filteredDispositionData,
      ...filteredSubDispositionData,
    });
    setUnallocatedLeadsCount(unallocatedLeads);
    let salesList = Object.values(salesMembers || {});
    setList({
      salesMembers: salesList,
    });
  }, [originalData]);

  const filterLeads = () => {
    if (!Array.isArray(originalData)) {
      return;
    }

    let filtered = [...originalData];
    let dispostionsFilter = [
      "Call Back",
      "Presentation",
      "Not Open",
      "Prospect",
      "Not Interested",
      "Deal Done",
    ];
    let subDispositionFilter = [
      "Prospect-Followup",
      "Presentation-Followup",
      "Payment-Followup",
    ];

    if (filters?.btnFilter) {
      if (dispostionsFilter.includes(filters?.btnFilter)) {
        filtered = filtered.filter((item) => {
          return item.disposition == filters.btnFilter;
        });
      } else if (subDispositionFilter.includes(filters?.btnFilter)) {
        filtered = filtered.filter((item) => {
          return item.subDisposition == filters.btnFilter;
        });
      } else if (filters?.btnFilter == "Today_Followup") {
        filtered = filtered?.filter((lead) => {
          if (lead?.followUpDate) {
            let followupdate = new Date(lead.followUpDate?._seconds * 1000);
            if (moment(followupdate).isSame(moment(), "date")) {
              return true;
            }
          }
          return false;
        });
      } else {
        filtered = [];
      }
    }

    if (filters?.salesMembers?.length > 0) {
      let salesMembers = filters?.salesMembers?.map((item) => item.value);
      filtered = filtered.filter((item) =>
        salesMembers.includes(item.salesExecutive)
      );
    }

    if (filters?.unAllocated) {
      filtered = filtered.filter(
        (item) => !item.salesExecutive || item.salesExecutive == ""
      );
    }

    // sort the data by hot lead and updated at
    if (filters?.btnFilter) {
      if (filters?.btnFilter == "Not Open") {
        console.log("is not open soring in desc");
        filtered = filtered.sort((a, b) => {
          // Check if either object has source 'facebook'
          if (
            a.subDisposition?.toLowerCase() === "facebook" &&
            b.subDisposition?.toLowerCase() !== "facebook"
          ) {
            return -1; // a comes before b
          }
          if (
            a.subDisposition?.toLowerCase() !== "facebook" &&
            b.subDisposition?.toLowerCase() === "facebook"
          ) {
            return 1; // b comes before a
          }

          // If both have source 'facebook', sort by createdAt in descending order
          if (
            a.subDisposition?.toLowerCase() === "facebook" &&
            b.subDisposition?.toLowerCase() === "facebook"
          ) {
            return (
              new Date(b.createdAt?._seconds * 1000) -
              new Date(a.createdAt?._seconds * 1000)
            ); // Descending order
          }

          // Otherwise, keep original order or apply any additional sorting criteria
          return 0;
        });
      } else {
        filtered = filtered.sort((a, b) => {
          // If updatedAt is missing, assign a default date (e.g., nulls come at the end)
          const dateA = a.updatedAt
            ? new Date(a.updatedAt?._seconds * 1000)
            : new Date(0); // Epoch time as the oldest date
          const dateB = b.updatedAt
            ? new Date(b.updatedAt?._seconds * 1000)
            : new Date(0);

          return dateA - dateB;
        });
      }
    }

    setLeads(filtered);
  };

  useEffect(() => {
    filterLeads();
  }, [selectedDisposition, selectedSubDisposition, filters, originalData]);

  const resetFilters = () => {
    setSelectedDisposition([]);
    setSelectedSubDisposition([]);
    setFilters({ unAllocated: false, salesMembers: [] });
    if (myData) {
      setMyData(false);
    }
  };

  const onSelectButtonFilter = (item) => {
    if (filters?.btnFilter == item) {
      return setFilters((pre) => ({ ...pre, btnFilter: null }));
    }
    setFilters((pre) => ({ ...pre, btnFilter: item }));
  };

  const getBtnSyle = (name) => {
    let color = cellColors[name];
    return {
      backgroundColor: color,
      color: "white",
    };
  };
  return (
    <div className="flex flex-col gap-2 w-full mb-2  mt-2">
      <div className="flex gap-[6px] items-center w-full overflow-x-auto scrollbar-none">
        <button
          onClick={resetFilters}
          className="flex text-nowrap items-center gap-1 hover:bg-colorPrimary/20 bg-colorPrimary/10 px-1 py-[2px] rounded-md border border-colorPrimary text-colorPrimary font-semibold text-[12px]"
        >
          Reset filters
          <MdClose className="text-colorPrimary text-base" />
        </button>
        {!isSalesPanel && currentLoggedInUser?.hierarchy !== "executive" && (
          <button
            onClick={() =>
              setFilters((pre) => ({
                ...pre,
                unAllocated: !pre.unAllocated,
              }))
            }
            className={`py-[2px] text-nowrap text-[12px] px-1 border font-semibold rounded-md ${
              filters?.unAllocated
                ? "bg-colorPrimary  text-white"
                : "bg-colorPrimary/20  text-gray-500"
            }`}
          >
            Unallocated leads{" "}
            {unallocatedLeadsCount && <span>({unallocatedLeadsCount})</span>}
          </button>
        )}
        {dispositionData &&
          Object.keys(dispositionData).map((item) => (
            <div className="flex flex-col">
              <button
                // disabled={
                //   item !== "Prospect-Followup" &&
                //   item !== "Presentation-Followup" &&
                //   item !== "Today_Followup"
                // }
                style={getBtnSyle(item)}
                className={`flex text-nowrap items-center gap-1 px-1 rounded py-[2px] text-[12px]`}
                onClick={() => onSelectButtonFilter(item)}
              >
                {item?.split("_").join(" ")} ({dispositionData[item]})
              </button>
              {filters?.btnFilter == item && (
                <span
                  style={getBtnSyle(item)}
                  className="p-[1px] mt-[2px] rounded-md"
                ></span>
              )}
            </div>
          ))}{" "}
      </div>
    </div>
  );
};

export default Filters;