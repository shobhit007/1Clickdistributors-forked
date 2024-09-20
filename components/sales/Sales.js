import React, { useMemo, useState } from "react";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "../utills/customTable";
import { camelToTitle } from "../utills/commonFunctions";
import Modal from "../utills/Modal";
import { MdClose } from "react-icons/md";
import { stages } from "@/lib/data/commonData";
import { toast } from "react-toastify";

export default function Sales() {
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

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
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in getting roles", error.message);
      return null;
    }
  };

  // Fetch user roles using react-query
  const {
    data,
    isLoading,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ["salesLeads"],
    queryFn: getLeads,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const columns = useMemo(() => {
    if (data?.leads?.length > 0) {
      return Object.keys(data?.leads[0] || {})
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
  }, [data?.leads]);

  const handleStageChange = (e) => {
    setSelectedStage(e.target.value);
  };

  const handleFollowUpDateChange = (e) => {
    setFollowUpDate(e.target.value);
  };

  const updateLeadStage = async () => {
    try {
      if (!selectedStage && !followUpDate) {
        toast.error("Please select a stage or follow up date");
        return;
      }
      const body = {
        leadId: selectedRows[0]?.leadId,
      };

      if (selectedStage) {
        body.stage = selectedStage;
      }

      if (followUpDate) {
        body.followUpDate = followUpDate;
      }

      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/updateLead`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("error in updateLead", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="pt-4">
      <div className="px-4 mb-6">
        <div className="w-full flex items-center gap-4">
          <button
            disabled={!selectedRows.length || selectedRows.length > 1}
            className={`rounded p-2 ${
              selectedRows.length == 1 ? "bg-colorPrimary" : "bg-gray-400"
            } text-white`}
          >
            View Details
          </button>
          <button
            disabled={!selectedRows.length || selectedRows.length > 1}
            className={`rounded p-2 ${
              selectedRows.length == 1 ? "bg-colorPrimary" : "bg-gray-400"
            } text-white`}
            onClick={() => setShowUpdateModal(true)}
          >
            Update
          </button>
        </div>
      </div>
      <CustomTable
        data={data?.leads || []}
        uniqueDataKey={"email"}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        columns={columns}
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />

      {showUpdateModal && (
        <Modal>
          <div className="h-[70vh] min-w-[90vw] md:min-w-[30vw] bg-white rounded-md relative overflow-auto">
            <div className="w-full flex justify-end">
              <button
                className="p-2 bg-red-500"
                onClick={() => {
                  setShowUpdateModal(false);
                  setFollowUpDate("");
                  setSelectedStage("");
                }}
              >
                <MdClose className="text-white text-3xl" />
              </button>
            </div>
            <div className="px-4 pt-8 pb-4 w-full">
              <select
                className={`border p-2 rounded-md border-gray-400 w-full`}
                name="stage"
                value={selectedStage}
                onChange={handleStageChange}
              >
                <option value={""}>Select stage</option>
                {stages?.map((stage) => (
                  <option value={stage} selected={selectedStage == stage}>
                    {stage}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                className="mt-4 w-full border-1 p-2 rounded border-gray-400"
                onChange={handleFollowUpDateChange}
              />

              <button
                className="mt-8 bg-colorPrimary text-white p-2 rounded-md w-full"
                onClick={updateLeadStage}
              >
                Update
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
