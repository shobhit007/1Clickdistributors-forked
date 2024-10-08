import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import DataChart from "./dataChart";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [dateObjToSearch, setDateObjToSearch] = useState(null);

  // get roles of the user
  const getUserRecord = async () => {
    try {
      return null;
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/getUserDetails`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in getting roles", error.message);
      return null;
    }
  };

  // Fetch user roles using react-query
  const { data: userRecord, refetch: refetchUserRecord } = useQuery({
    queryKey: ["userRecord"],
    queryFn: getUserRecord,
  });

  const userData = {
    NI: 10,
    "Deal done": 3,
    Presentation: 10,
    "Presentation followup": 12,
    "Call back": 16,
    Prospect: 8,
  };

  const handleSetDate = () => {};

  return (
    <div className="w-full h-[95vh] overflow-auto p-3">
      {loading && (
        <div className="w-full flex justify-center my-1">
          <img src="/loader.gif" className="h-12 w-auto" />
        </div>
      )}

      <div className="flex gap-2 items-end py-1 px-3 rounded-md flex-wrap my-2 mb-6">
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
          onClick={handleSetDate}
          className="text-white bg-blue-500 px-2 py-1 rounded-md text-xs"
        >
          Search
        </button>
      </div>

      <div className="w-full flex justify-center h-[60vh]">
        <DataChart stats={userData} />
      </div>
    </div>
  );
};

export default index;
