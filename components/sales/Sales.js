import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "../utills/customTable";
import { camelToTitle } from "../utills/commonFunctions";
import Modal from "../utills/Modal";
import UpdateLead from "./UpdateLead";
import MultiSelectDropDown from "../uiCompoents/MultiSelectDropDown";
import { dispositions, subDispositions } from "@/lib/data/commonData";
import { RiCloseCircleFill } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import LeadUpdateHistory from "../leadUpdateHistory";
import ShowDetails from "../allocateLead/showDetails";

const salesFilters = ["All", "Pendings", "New Leads", "Follow Ups"];

export default function Sales() {
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [date, setDate] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filters, setFilters] = useState({
    divisions: [],
  });

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateHistoryModal, setShowUpdateHistoryModal] = useState(false);

  // search for default date
  useEffect(() => {
    setDate({
      startDate: startDate,
      endDate: endDate,
    });
  }, []);

  // get roles of the user
  const getLeads = async () => {
    try {
      if (!date) return null;
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getLeads`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          startDate: date.startDate,
          endDate: date.endDate,
        }),
      });

      const data = await response.json();
      if (data.success) {
        return data.leads;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in getting roles", error.message);
      return null;
    }
  };

  // Fetch user roles using react-query
  const { data: leads } = useQuery({
    queryKey: ["salesLeads", date],
    queryFn: getLeads,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleSearchLeads = () => {
    setDate({
      startDate: startDate,
      endDate: endDate,
    });
  };

  const staticColumns = [
    "assignedAt",
    "createdAt",
    "updatedAt",
    "disposition",
    "subDisposition",
    "FollowUpDate",
  ];

  const avoidCols = ["id"];

  const columns = useMemo(() => {
    if (leads?.length > 0) {
      let dynamicCols = Object.keys(leads[0] || {})
        .filter((key) => {
          if (avoidCols.includes(key) || staticColumns.includes(key)) {
            return false;
          }
          if (typeof leads[0][key] == "object") {
            return false;
          }
          return true;
        })
        .map((key) => {
          return {
            Header: camelToTitle(key),
            accessor: key,
            id: key,
          };
        });

      let statiCols = staticColumns.map((key) => {
        if (key == "assignedAt" || key == "createdAt" || key == "updatedAt") {
          return {
            Header: key,
            accessor: key,
            Cell: ({ value }) => {
              return (
                value && (
                  <p>
                    {new Date(value?._seconds * 1000)?.toLocaleDateString()}
                  </p>
                )
              );
            },
            sortType: (rowA, rowB, columnId) => {
              const dateA = rowA.values[columnId]?._seconds
                ? new Date(rowA.values[columnId]?._seconds * 1000)
                : null;
              const dateB = rowB.values[columnId]?._seconds
                ? new Date(rowB.values[columnId]?._seconds * 1000)
                : null;

              if (!dateA && !dateB) return 0; // Both dates are missing
              if (!dateA) return 1; // dateA is missing, place it after dateB
              if (!dateB) return -1; // dateB is missing, place it after dateA

              return dateA > dateB ? 1 : -1; // Compare valid dates
            },
            id: key,
          };
        }
        return {
          Header: camelToTitle(key),
          accessor: key,
          id: key,
        };
      });

      return [...dynamicCols, ...statiCols];
    } else {
      return [];
    }
  }, [leads]);

  const subDispositionOptions = [
    ...new Set(Object.values(subDispositions).flat()),
  ];

  const filterSalesLeads = () => {
    if (!leads) return [];
    const filteredLeads = leads?.filter((lead) => {
      if (selectedFilter === "All") {
        return true;
      } else if (selectedFilter === "Pendings") {
        return lead.disposition === "Not Open";
      } else if (selectedFilter === "New Leads") {
        if (
          lead.disposition === "Not Open" &&
          moment(lead.createdAt).isAfter(moment().startOf("day")) &&
          moment(lead.createdAt).isBefore(moment().endOf("day"))
        ) {
          return true;
        }
      } else if (selectedFilter === "Follow Ups") {
        return lead.disposition === "FollowUp";
      }
    });

    return filteredLeads;
  };

  return (
    <div className="pt-4">
      <div className="px-4 mb-6">
        <div className="flex gap-2 items-end rounded-md flex-wrap">
          <div className="flex gap-2">
            <div className="flex flex-col">
              <span className="text-[12px] text-gray-500">From</span>
              <input
                type="date"
                className="text-[12px] border border-gray-600 rounded px-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-gray-500">To</span>
              <input
                type="date"
                className="text-[12px] border border-gray-600 rounded px-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex ml-2">
              <button
                onClick={handleSearchLeads}
                className="text-white bg-blue-500 px-2 py-1 rounded-md text-xs mt-auto"
              >
                Search
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-4 flex-wrap">
            <button
              onClick={() => setSelectedRows([])}
              disabled={!selectedRows.length}
              className={`text-nowrap rounded px-3 py-1 text-sm flex gap-2 items-center ${
                selectedRows.length > 0 ? "bg-colorPrimary" : "bg-gray-400"
              } text-white`}
            >
              Unselect All {selectedRows?.length > 0 ? selectedRows.length : ""}
              <RiCloseCircleFill />
            </button>
            <button
              onClick={() => setShowDetailsModal(true)}
              disabled={selectedRows.length != 1}
              className={`rounded text-nowrap px-3 py-1 text-sm ${
                selectedRows.length === 1 ? "bg-colorPrimary" : "bg-gray-400"
              } text-white`}
            >
              View Details
            </button>
            <button
              disabled={!selectedRows.length}
              className={`rounded text-nowrap px-3 py-1 text-sm ${
                selectedRows.length > 0 ? "bg-colorPrimary" : "bg-gray-400"
              } text-white`}
              onClick={() => setShowUpdateModal(true)}
            >
              Update
            </button>
            <button
              disabled={selectedRows?.length != 1}
              className={`rounded text-nowrap px-3 py-1 text-sm bg-colorPrimary disabled:bg-gray-400 text-white`}
              onClick={() => setShowUpdateHistoryModal(true)}
            >
              Update History
            </button>
          </div>
        </div>

        <div className="flex flex-1 gap-2 mt-2 flex-wrap w-full">
          <MultiSelectDropDown label={"Dispositions"} options={dispositions} />
          <MultiSelectDropDown
            label={"Sub Dispositions"}
            options={subDispositionOptions}
          />
          {salesFilters.map((filter, idx) => (
            <button
              key={idx.toString()}
              onClick={() => setSelectedFilter(filter)}
              className={`border text-nowrap rounded px-4 py-1 text-sm cursor-pointer ${
                selectedFilter === filter ? "bg-colorPrimary" : "bg-white"
              } ${
                selectedFilter === filter
                  ? "border-colorPrimary"
                  : "border-gray-300"
              } ${selectedFilter === filter ? "text-white" : "text-gray-600"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <CustomTable
        data={filterSalesLeads() || []}
        uniqueDataKey={"leadId"}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        columns={columns}
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />

      {showUpdateModal && (
        <Modal>
          <UpdateLead
            onClose={() => setShowUpdateModal(false)}
            leads={selectedRows}
          />
        </Modal>
      )}
      {showUpdateHistoryModal && (
        <Modal>
          <div className="p-3 w-[90vw] sm:w-[65vw] md:w-[50vw] bg-white lg:w-[35vw] rounded-md h-[80vh] overflow-auto relative">
            <MdClose
              className="text-red-600 absolute top-1 right-1 text-xl cursor-pointer"
              onClick={() => setShowUpdateHistoryModal(false)}
            />

            <LeadUpdateHistory
              leadId={selectedRows[0]?.leadId}
              close={() => setShowUpdateHistoryModal(false)}
            />
          </div>
        </Modal>
      )}

      {showDetailsModal && (
        <Modal>
          <div className="w-[90vw] sm:w-[55vw] md:w-[45vw] xl:w-[35vw] h-[70vh] bg-white rounded-md p-2 relative">
            <MdClose
              className="text-red-500 absolute top-2 right-4 cursor-pointer text-2xl"
              onClick={() => setShowDetailsModal(false)}
            />

            <ShowDetails
              data={selectedRows?.[0]}
              close={() => setShowDetailsModal(false)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
