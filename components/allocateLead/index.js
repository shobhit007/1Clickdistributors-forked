import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../utills/customTable";
import { camelToTitle } from "../utills/commonFunctions";
import { RiSettings2Line } from "react-icons/ri";
import moment from "moment";
import Modal from "../utills/Modal";
import { MdClose } from "react-icons/md";
import AllocateLeadModal from "./allocateLeadModal";
import { useQuery } from "@tanstack/react-query";

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

  useEffect(() => {
    if (!leads) {
      setSelectedStartDate(moment().startOf("day").format("YYYY-MM-DD"));
      setSelectedEndDate(moment().endOf("day").format("YYYY-MM-DD"));
    }
  }, []);

  const handleAssignLeads = async () => {
    try {
      setShowAllocationModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

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

  const columns = useMemo(() => {
    if (leads?.length > 0) {
      return Object.keys(leads[0] || {})
        .filter((key) => {
          if (key == "createdAt") {
            return false;
          }
          return true;
        })
        .map((key) => {
          if (key == "createdAt") {
            return {
              Header: "Created At",
              accessor: key,
              Cell: ({ value }) => {
                return <p>{new Date(value)?.toLocaleDateString()}</p>;
              },
              sortType: (rowA, rowB, columnId) => {
                const dateA = new Date(rowA.values[columnId]);
                const dateB = new Date(rowB.values[columnId]);
                return dateA > dateB ? 1 : -1;
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
    } else {
      return [];
    }
  }, []);

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
          className="bg-colorPrimary disabled:bg-colorPrimary/40 disabled:cursor-not-allowed py-1 px-3 rounded-md text-white"
          onClick={() => setShowAllocationModal(true)}
        >
          Allocate lead
        </button>
      </div>
      <CustomTable
        data={leads || []}
        uniqueDataKey={"id"}
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
