import React, { useMemo, useState } from "react";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "../utills/customTable";
import { camelToTitle } from "../utills/commonFunctions";
import Modal from "../utills/Modal";
import UpdateLead from "./UpdateLead";

export default function Sales() {
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // get roles of the user
  const getLeads = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getLeads`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          startDate: moment("2024-09-15"),
          endDate: moment(),
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
  const { data: leads, refetch: refetchRoles } = useQuery({
    queryKey: ["salesLeads"],
    queryFn: getLeads,
    retry: false,
    refetchOnWindowFocus: false,
  });

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

  return (
    <div className="pt-4">
      <div className="px-4 mb-6">
        <div className="w-full flex items-center gap-4">
          <button
            disabled={!selectedRows.length || selectedRows.length > 1}
            className={`rounded p-2 ${
              selectedRows.length === 1 ? "bg-colorPrimary" : "bg-gray-400"
            } text-white`}
          >
            View Details
          </button>
          <button
            disabled={!selectedRows.length}
            className={`rounded p-2 ${
              selectedRows.length > 0 ? "bg-colorPrimary" : "bg-gray-400"
            } text-white`}
            onClick={() => setShowUpdateModal(true)}
          >
            Update
          </button>
        </div>
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

      {showUpdateModal && (
        <Modal>
          <UpdateLead
            onClose={() => setShowUpdateModal(false)}
            leads={selectedRows}
          />
        </Modal>
      )}
    </div>
  );
}
