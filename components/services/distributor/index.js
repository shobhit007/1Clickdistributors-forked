import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Filters from "../Filters";
import { compareDesignations } from "@/lib/commonFunctions";
import CustomTable from "@/components/utills/customTable";
import { camelToTitle } from "@/components/utills/commonFunctions";
import { leadsPanelColumns } from "@/lib/data/commonData";
import moment from "moment";
import AllocateServiceLead from "../AllocateServiceLead";
import RenderTable from "../RenderTable";
import UpdateLeadModal from "../manufacturer/UpdateLeadModal";

const index = ({
  dateObjToSearch,
  searchValue,
  setSearchValue,
  selectedRows,
  setSelectedRows,
}) => {
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState(null);
  const [selectedServiceMembers, setSelectedServiceMembers] = useState([]);
  const [selectedSubTab, setSelectedSubTab] = useState("welcome_calls");
  const [updateLead, setUpdateLead] = useState(false);

  const subTabs = [
    {
      label: "Welcome calls",
      value: "welcome_calls",
    },
    {
      label: "My allocations",
      value: "my_allocations",
    },
    {
      label: "Distributor Onboarding",
      value: "distributor_onboarding",
    },
    {
      label: "Live Distributor",
      value: "live_distributor",
    },
  ];

  const getServiceLeads = async () => {
    try {
      if (!dateObjToSearch) return null;
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/distributor/getLeads`;
      setLoading(true);
      let payload = {
        startDate: dateObjToSearch?.selectedStartDate,
        endDate: dateObjToSearch?.selectedEndDate,
        value: selectedSubTab,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        return data.leads || [];
      } else {
        return null;
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.log("error in getting update data", error.message);
      return null;
    }
  };

  const { data, refetch } = useQuery({
    queryKey: ["distributorLeads", dateObjToSearch, selectedSubTab],
    queryFn: getServiceLeads,
  });

  const filterTable = () => {
    if (searchValue == "") {
      setLeads(data);
    }
    // Convert searchValue to lowercase to make the search case-insensitive
    const lowerSearchValue = searchValue?.toLowerCase();
    // Filter the array of objects
    const filtered = data?.filter((obj) =>
      Object.values(obj).some((value) =>
        value?.toString().toLowerCase().includes(lowerSearchValue)
      )
    );

    setLeads(filtered);
  };

  useEffect(() => {
    if (Array.isArray(data)) {
      filterTable();
    }
  }, [searchValue, data?.length]);

  const run = () => {
    refetch();
    const res = compareDesignations("sales", "Team Manager");
    console.log("result", res);
  };

  return (
    <div className="w-full h-full">
      <div className="flex gap-1 h-[24px] items-center mt-1 overflow-auto scrollbar-none">
        {subTabs.map((tab) => {
          return (
            <button
              className={`py-[1px] sm:py-[2px] px-1 border sm:px-3 h-fit rounded text-nowrap ${
                selectedSubTab == tab.value
                  ? "bg-[#4d82fc] border-[#4d82fc] text-white"
                  : "border-[#4c83ff6e] text-blue-400"
              } text-[10px] sm:text-xs font-semibold `}
              onClick={() => setSelectedSubTab(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="h-[95%]">
        {loading && (
          <div className="w-full flex flex-col items-center justify-center">
            <img src="/loader.gif" className="h-[30px] w-auto" alt="loading" />
            <p className="text-xl font-bold text-gray-500 mt-3">
              Loading leads... please wait
            </p>
          </div>
        )}

        {Array.isArray(data) ? (
          data.length > 0 ? (
            <div
              className={`w-full flex flex-1 ${
                selectedRows?.length ? "h-[90%]" : "h-full"
              } flex flex-col`}
            >
              <RenderTable
                leads={leads}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                searchValue={searchValue}
                setUpdateLead={setUpdateLead}
              />
            </div>
          ) : (
            <h1 className="text-xl font-semibold text-center w-full text-gray-500">
              No data to show for this time range
            </h1>
          )
        ) : null}
        {selectedRows?.length > 0 && (
          <AllocateServiceLead data={selectedRows} />
        )}
      </div>

      {updateLead && (
        <UpdateLeadModal
          closeModal={() => setUpdateLead(false)}
          selectedRow={selectedRows[0]}
          serviceType="distributor"
        />
      )}
    </div>
  );
};

export default index;
