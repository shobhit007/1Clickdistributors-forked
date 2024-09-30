import { salesPanelColumns } from "@/lib/data/commonData";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TableColumns = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [selectedCols, setSelectedCols] = useState([]);

  const getAllAssignedColumns = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/panel/getAllColumnsForSalesPanel`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("data is", data);
      if (data.success && data.data) {
        return data.data;
      } else {
        toast.error(data.message || "couldn't fetch columns");
        return null;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { data: assignedColumns, refetch } = useQuery({
    queryKey: ["assignedColumns"],
    queryFn: getAllAssignedColumns,
  });

  useEffect(() => {
    if (assignedColumns) {
      setSelectedCols(assignedColumns);
    }
  }, [assignedColumns]);

  const handleList = (item) => {
    if (selectedCols.includes(item)) {
      setSelectedCols((pre) => pre.filter((i) => i !== item));
    } else {
      setSelectedCols((pre) => [...pre, item]);
    }
  };

  const updateColumns = async () => {
    try {
      if (selectedCols?.length == 0) {
        return toast.error("Please select columns");
      }
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/panel/updateColumnsForSalesPanel`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ columns: selectedCols }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || "successfully updated");
        refetch();
        setIsEditable(false);
      } else {
        toast.error(data.message || "couldn't update columns");
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      console.log("error in updateColumns", error.message);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <p className="text-lg font-semibold text-gray-600 underline">
        2. Columns to show in sales panel
      </p>
      <div className="mt-2 flex gap-2 w-full flex-wrap">
        {salesPanelColumns?.map((item) => {
          return (
            <button
              onClick={() => handleList(item)}
              disabled={!isEditable}
              className={`py-1 px-2 rounded-md border text-sm ${
                selectedCols?.includes(item)
                  ? "bg-colorPrimary disabled:bg-colorPrimary/50 text-white"
                  : "bg-transparent text-gray-600"
              } font-semibold`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 mt-3 text-sm">
        {isEditable ? (
          <>
            <button
              onClick={() => {
                setIsEditable(false);
                setSelectedCols(assignedColumns);
              }}
              className="py-1 px-3 rounded bg-gray-500 text-white"
            >
              Cancel
            </button>
            <button
              onClick={updateColumns}
              className="py-1 px-3 rounded bg-blue-500 text-white"
            >
              Update
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditable(true)}
            className="py-1 px-3 rounded bg-blue-500 text-white"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default TableColumns;
