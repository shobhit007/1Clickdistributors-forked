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

const index = () => {
  let data = [
    {
      name: "Abhishek",
      role: "superAdministrator",
      age: 22,
      createdAt: "2024-09-18T11:33:35.678Z",
      language: "js",
    },
    {
      name: "Shubham",
      role: "administrator",
      age: 26,
      createdAt: "2024-09-13T11:33:35.678Z",
      language: "python",
    },
    {
      name: "Aman",
      role: "manager",
      age: 22,
      createdAt: "2024-09-18T11:33:35.678Z",
      language: "python",
    },
    {
      name: "Vijay",
      role: "sales",
      age: 23,
      createdAt: "2024-09-12T11:33:35.678Z",
      language: "java",
    },
    {
      name: "Rohit",
      role: "superAdministrator",
      age: 27,
      createdAt: "2024-09-10T11:33:35.678Z",
      language: "ruby",
    },
    {
      name: "Aakash",
      role: "administrator",
      age: 28,
      createdAt: "2024-09-28T11:33:35.678Z",
      language: "go",
    },
    {
      name: "Nishant",
      role: "manager",
      age: 24,
      createdAt: "2024-09-11T11:33:35.678Z",
      language: "js",
    },
    {
      name: "Siddharth",
      role: "sales",
      age: 25,
      createdAt: "2024-09-29T11:33:35.678Z",
      language: "python",
    },
    {
      name: "Harsh",
      role: "superAdministrator",
      age: 30,
      createdAt: "2024-09-01T11:33:35.678Z",
      language: "java",
    },
    {
      name: "Ishan",
      role: "administrator",
      age: 21,
      createdAt: "2024-09-08T11:33:35.678Z",
      language: "ruby",
    },
    {
      name: "Kartik",
      role: "manager",
      age: 29,
      createdAt: "2024-09-07T11:33:35.678Z",
      language: "go",
    },
    {
      name: "Manish",
      role: "sales",
      age: 23,
      createdAt: "2024-09-14T11:33:35.678Z",
      language: "js",
    },
    {
      name: "Ravi",
      role: "superAdministrator",
      age: 27,
      createdAt: "2024-09-02T11:33:35.678Z",
      language: "python",
    },
    {
      name: "Rahul",
      role: "administrator",
      age: 26,
      createdAt: "2024-09-18T11:33:35.678Z",
      language: "java",
    },
    {
      name: "Sumit",
      role: "manager",
      age: 25,
      createdAt: "2024-09-07T11:33:35.678Z",
      language: "ruby",
    },
    {
      name: "Tanmay",
      role: "sales",
      age: 28,
      createdAt: "2024-09-09T11:33:35.678Z",
      language: "go",
    },
    {
      name: "Ujjwal",
      role: "superAdministrator",
      age: 22,
      createdAt: "2024-09-22T11:33:35.678Z",
      language: "js",
    },
    {
      name: "Yash",
      role: "administrator",
      age: 24,
      createdAt: "2024-09-27T11:33:35.678Z",
      language: "python",
    },
    {
      name: "Zaid",
      role: "manager",
      age: 26,
      createdAt: "2024-09-30T11:33:35.678Z",
      language: "java",
    },
    {
      name: "Vivek",
      role: "sales",
      age: 29,
      createdAt: "2024-09-17T11:33:35.678Z",
      language: "ruby",
    },
  ];
  const [openModal, setOpenModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [allocatingLeads, setAllocatingLeads] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (!leads) {
      setSelectedStartDate(moment().startOf("day").format("YYYY-MM-DD"));
      setSelectedEndDate(moment().endOf("day").format("YYYY-MM-DD"));
    }
  }, []);

  const getAllLeads = async () => {
    try {
      if (
        !selectedStartDate ||
        selectedStartDate == "" ||
        selectedEndDate == "" ||
        !selectedEndDate
      ) {
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
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        }),
      });
      const data = await response.json();
      console.log("data is", data);
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

  const { data: leads, refetch: refetchLeads } = useQuery({
    queryKey: ["allLeads"],
    queryFn: getAllLeads,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleAssignLeads = async (salesMember) => {
    try {
      if (!salesMember || salesMember == "") {
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
          salesMember,
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

  const columns = useMemo(() => {
    if (leads?.length > 0) {
      let dynamicCols = Object.keys(leads[0] || {})
        .filter(
          (key) => !(avoidCols.includes(key) || staticColumns.includes(key))
        )
        .map((key) => {
          return {
            Header: camelToTitle(key),
            accessor: key,
            id: key,
          };
        });

      let statiCols = staticColumns.map((key) => {
        if (key == "assignedAt" || key == "createdAt") {
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

  if (leadsLoading) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center">
        <img src="/loader.gif" className="h-[60px] w-auto" alt="loading" />
        <p className="text-xl font-bold text-gray-500 mt-3">
          Loading leads... please wait
        </p>
      </div>
    );
  }

  const handleRefetchLeads = () => {
    refetchLeads();
  };

  return (
    <div className="mt-4 px-2">
      <button onClick={refetchLeads}>Refetch</button>
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
      {showAllocationModal && (
        <Modal>
          <div className="w-[90vw] sm:w-[50vw] md:w-[30vw] xl:w-[25vw] h-[50vh] bg-white rounded-md p-2 relative">
            <MdClose
              className="text-red-500 absolute top-2 right-4 cursor-pointer text-2xl"
              onClick={() => setShowAllocationModal(false)}
            />

            <AllocateLeadModal
              data={selectedRows}
              onSubmit={handleAssignLeads}
              loading={allocatingLeads}
            />
          </div>
        </Modal>
      )}

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
          disabled={selectedRows?.length == 0}
          className="bg-colorPrimary flex items-center gap-1 disabled:bg-colorPrimary/40 disabled:cursor-not-allowed py-1 px-3 rounded-md text-white"
          onClick={() => setShowAllocationModal(true)}
        >
          <span>Allocate lead {selectedRows?.length}</span>
        </button>
        {selectedRows?.length > 0 && (
          <button
            className="bg-gray-500 flex items-center gap-1 disabled:bg-colorPrimary/40 disabled:cursor-not-allowed py-1 px-3 rounded-md text-white"
            onClick={() => setSelectedRows([])}
          >
            Unselect all
          </button>
        )}
        {selectedRows?.length == 1 && (
          <button
            className="bg-colorPrimary flex items-center gap-1 disabled:bg-colorPrimary/40 disabled:cursor-not-allowed py-1 px-3 rounded-md text-white"
            onClick={() => setShowDetailsModal(true)}
          >
            See details
          </button>
        )}
      </div>
      <CustomTable
        data={leads || []}
        uniqueDataKey={"email"}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        columns={columns}
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />
    </div>
  );
};

export default index;
