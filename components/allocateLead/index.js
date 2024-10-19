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
import Table from "../utills/Table";

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
  const [workModalVisible, setWorkModalVisible] = useState(false);
  const [uploadModalVisible, setUploadVisible] = useState(false);
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
          salesMemberName: salesMember.name,
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
        <button
          onClick={() => setUploadVisible(true)}
          className="rounded py-1 px-2 text-white bg-gray-400 hover:bg-gray-600"
        >
          Import Excel
        </button>
        {/* <button
          onClick={() => setWorkModalVisible(true)}
          className="rounded py-1 px-2 text-white bg-gray-400 hover:bg-gray-600"
        >
          Today work
        </button> */}
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

      {/* {workModalVisible && (
        <Modal>
          <WorkedLeads setWorkModalVisible={setWorkModalVisible} />
        </Modal>
      )} */}

      {uploadModalVisible && (
        <Modal>
          <UploadExcelData onClose={() => setUploadVisible(false)} />
        </Modal>
      )}
    </div>
  );
};

const UploadExcelData = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const uploadExcelFile = async () => {
    try {
      if (!file) {
        toast.error("Please select a file");
        setLoading(false);
        return;
      }
      setLoading(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/importLeadsFromExcel`;
      let token = localStorage.getItem("authToken");

      // Create a FormData object to hold the file
      const formData = new FormData();
      formData.append("file", file); // Append the file to the FormData

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Use FormData as the body
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setLoading(false);
        onClose();
      } else {
        toast.error(result.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-80 bg-white border shadow-sm rounded relative px-4 pt-10 pb-6 overflow-hidden">
      <button
        className="bg-red-600 text-white text-base absolute top-0 right-0 px-4"
        onClick={onClose}
      >
        close
      </button>
      <div>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={onChange}
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "
        />
        <button
          disabled={loading}
          onClick={uploadExcelFile}
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Uploading..." : "Upload Excel"}
        </button>
      </div>
    </div>
  );
};

const WorkedLeads = ({ setWorkModalVisible }) => {
  const [search, setSearch] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [updatedData, setupdatedData] = useState([]);

  const getAllUpdatedLeadsCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getUpdatedLeadsCount`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let result = await response.json();
      if (result.success) {
        result = result.data.map((item) => {
          return {
            ...item,
            totalLeads: item?.leadCounts?.totalLeadsAssigned,
            remainingLeads: item?.leadCounts?.remainingLeads,
            updatedToday: item?.leadCounts?.leadsUpdatedToday,
          };
        });

        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in getting leads", error.message);
      return null;
    }
  };

  const {
    data: leadsStats,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["LeadsStats"],
    queryFn: getAllUpdatedLeadsCount,
  });

  useEffect(() => {
    if (leadsStats) {
      setOriginalData(leadsStats);
      setupdatedData(leadsStats);
    }
  }, [leadsStats]);

  useEffect(() => {
    if (search === "") {
      setupdatedData(originalData);
    } else {
      const filteredData = originalData.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setupdatedData(filteredData);
    }
  }, [search, originalData]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Hierarchy",
        accessor: "hierarchy",
      },
      {
        Header: "Total Leads",
        accessor: "totalLeads",
      },
      {
        Header: "Updated Today",
        accessor: "updatedToday",
      },
      {
        Header: "Remaining Leads",
        accessor: "remainingLeads",
      },
    ],
    []
  );

  return (
    <div className="w-full h-[100vh] bg-white p-4 md:p-8 relative overflow-auto">
      <button
        className="absolute right-0 top-0 bg-red-600 text-white py-1 px-3 text-base"
        onClick={() => setWorkModalVisible(false)}
      >
        close
      </button>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <img src="/loader.gif" className="h-[60px] w-auto" alt="loading" />
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full flex">
            <input
              type="text"
              placeholder="Search Name"
              className="border border-gray-300 rounded-md px-3 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                // TODO: Implement search functionality
                setSearch(e.target.value);
              }}
            />
            <button
              className="bg-colorPrimary text-white px-4 rounded"
              onClick={refetch}
            >
              Refresh
            </button>
          </div>
          <div className="w-full mt-4">
            <Table data={updatedData} columns={columns} />
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
