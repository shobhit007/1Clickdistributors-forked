import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../utills/customTable";
import { camelToTitle } from "../utills/commonFunctions";
import { RiSettings2Line } from "react-icons/ri";
import moment from "moment";
import Modal from "../utills/Modal";
import { MdClose } from "react-icons/md";
import AllocateLeadModal from "./allocateLeadModal";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import local from "next/font/local";
import ShowDetails from "./showDetails";
import ManualLeadForm from "../utills/ManualLeadForm";
import Filters from "./filters";

const index = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [allocatingLeads, setAllocatingLeads] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [dateObjToSearch, setDateObjToSearch] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [leads, setLeads] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const getAllLeads = async () => {
    try {
      if (!dateObjToSearch) {
        return null;
      }

      const token = localStorage.getItem("authToken");
      setLeadsLoading(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getLeads`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: dateObjToSearch?.selectedStartDate,
          endDate: dateObjToSearch?.selectedEndDate,
        }),
      });
      const data = await response.json();
      setLeadsLoading(false);
      if (data.success && data?.leads) {
        return data.leads;
      } else {
        return null;
      }
    } catch (error) {
      setLeadsLoading(false);
      console.log("error in getting leads", error.message);
      return null;
    }
  };

  const { data, refetch: refetchLeads } = useQuery({
    queryKey: ["allLeads", dateObjToSearch],
    queryFn: getAllLeads,
  });

  useEffect(() => {
    let start = moment()
      .startOf("day")
      .subtract({ days: 4 })
      .format("YYYY-MM-DD");
    let end = moment().endOf("day").format("YYYY-MM-DD");
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    setDateObjToSearch({
      selectedStartDate: start,
      selectedEndDate: end,
    });
  }, []);

  const handleAssignLeads = async (salesMember) => {
    try {
      if (!salesMember.id) {
        return;
      }
      const leads = selectedRows?.map((item) => item.leadId);
      setAllocatingLeads(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/assignLeadsToSalesMember`;
      let token = localStorage.getItem("authToken");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leads,
          salesMember: salesMember.id,
        }),
      });
      setAllocatingLeads(false);
      const data = await response.json();

      if (data.success) {
        toast.success(data?.message || "Successfully allocated leads");
        setShowAllocationModal(false);
        refetchLeads();
        setSelectedRows([]);
      } else {
        toast.error(data?.message || "Failed to allocate");
      }
    } catch (error) {
      toast.error(error.message);
      setAllocatingLeads(false);
    }
  };

  const staticColumns = [
    "assignedAt",
    "createdAt",
    "assignedBy",
    "salesExecutive",
  ];
  const avoidCols = ["id", "adType"];

  let checkMarkCol = ["Select"].map((key) => {
    return {
      Header: camelToTitle(key),
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={
              selectedRows?.filter(
                (item) => item.leadId == row?.original?.leadId
              )?.length > 0
            }
            readOnly={true}
          />
        </div>
      ),
    };
  });
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
        if (key == "salesExecutive") {
          return {
            Header: camelToTitle(key),
            accessor: "salesExecutiveName",
            id: key,
          };
        }
        return {
          Header: camelToTitle(key),
          accessor: key,
          id: key,
        };
      });

      return [...checkMarkCol, ...dynamicCols, ...statiCols];
    } else {
      return [];
    }
  }, [leads, selectedRows]);

  const handleRefetchLeads = () => {
    setDateObjToSearch({
      selectedStartDate,
      selectedEndDate,
    });
  };

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
    if (Array.isArray(data) && data?.length > 0) {
      console.log("filtereing");
      filterTable();
    }
  }, [searchValue, data?.length]);

  return (
    <div className="py-1 px-2">
      <div className="flex items-center gap-4">
        <button onClick={refetchLeads}>Refetch</button>
        <button
          onClick={() => setFormVisible(true)}
          className="rounded py-1 px-2 text-white bg-gray-400 hover:bg-gray-600"
        >
          Create Manual Lead
        </button>
      </div>
      <div className="flex items-center gap-4 px-2 flex-wrap my-2">
        <div className="flex gap-2 bg-gray-200 items-end py-1 px-3 rounded-md flex-wrap">
          <div className="flex flex-col">
            <span className="text-[12px] text-gray-500">From</span>
            <input
              type="date"
              className="text-[12px] border border-gray-600 rounded px-2"
              value={selectedStartDate}
              onChange={(e) => setSelectedStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-gray-500">To</span>
            <input
              type="date"
              className="text-[12px] border border-gray-600 rounded px-2"
              value={selectedEndDate}
              onChange={(e) => setSelectedEndDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleRefetchLeads}
            className="text-white bg-blue-500 px-2 py-1 rounded-md text-xs"
          >
            Search
          </button>
        </div>
        <RiSettings2Line
          onClick={() => setOpenModal(true)}
          className="text-gray-800 text-2xl font-semibold cursor-pointer"
        />
        <button
          disabled={!selectedRows?.length}
          className="bg-gray-500 flex items-center gap-1 disabled:bg-gray-500/40 disabled:cursor-not-allowed py-1 px-3 rounded-md text-white"
          onClick={() => setSelectedRows([])}
        >
          Unselect all
        </button>

        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="min-w-[160px] border border-gray-400 outline-blue-500 py-1 px-2 rounded"
          placeholder="Enter to search table"
        />
      </div>

      <Filters setLeads={setLeads} leads={leads} originalData={data} />

      {leadsLoading && (
        <div className="w-full flex flex-col items-center justify-center">
          <img src="/loader.gif" className="h-[30px] w-auto" alt="loading" />
          <p className="text-xl font-bold text-gray-500 mt-3">
            Loading leads... please wait
          </p>
        </div>
      )}

      {leads?.length > 0 ? (
        <CustomTable
          data={leads || []}
          uniqueDataKey={"leadId"}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          columns={columns}
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          searchValue={searchValue}
        />
      ) : (
        !leadsLoading && (
          <div className="mt-10 w-full flex px-4">
            <h1 className="text-gray-600 font-semibold text-2xl">
              No data found with current date and filters.
            </h1>
          </div>
        )
      )}

      {selectedRows?.length > 0 && (
        <AllocateLeadModal
          data={selectedRows}
          onSubmit={handleAssignLeads}
          loading={allocatingLeads}
        />
      )}
      {formVisible && (
        <Modal>
          <div className="w-full h-[100vh] py-4 md:py-8">
            <ManualLeadForm onClose={() => setFormVisible(false)} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default index;
