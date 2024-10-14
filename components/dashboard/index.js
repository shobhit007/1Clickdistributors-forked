import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import DataChart from "./dataChart";
import moment from "moment";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [date, setDate] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let startD = moment().startOf("day").format("YYYY-MM-DD");
    let endD = moment().endOf("day").format("YYYY-MM-DD");
    setSelectedStartDate(startD);
    setSelectedEndDate(endD);
    setDate({
      startDate: startD,
      endDate: endD,
    });
  }, []);

  // get roles of the user
  const getUserDataForDashboard = async () => {
    try {
      if (!date) return null;
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getDataForDashboard`;
      setLoading(true);
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
      setLoading(false);
      if (data.success) {
        return data.leads;
      } else {
        return null;
      }
    } catch (error) {
      setLoading(false);
      console.log("error in getting update data", error.message);
      return null;
    }
  };

  // Fetch user roles using react-query
  const { data } = useQuery({
    queryKey: ["userUpdateData", date],
    queryFn: getUserDataForDashboard,
  });

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      let obj = {};

      data.forEach((lead) => {
        if (lead.disposition) {
          if (!obj.hasOwnProperty([lead.disposition])) {
            obj[lead.disposition] = 0;
          }
          obj[lead.disposition]++;
        }
      });
      setUserData(obj);
    } else {
      setUserData(null);
    }
  }, [data]);

  // const userData = {
  //   NI: 10,
  //   "Deal done": 3,
  //   Presentation: 10,
  //   "Presentation followup": 12,
  //   "Call back": 16,
  //   Prospect: 8,
  // };

  const handleSetDate = () => {
    setDate({
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    });
  };

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

      {!userData && (!data || data.length === 0) && !loading && (
        <h1 className="text-gray-600 font-semibold text-xl w-full text-center">
          Looks like no leads updated within selected time range
        </h1>
      )}
      {userData && (
        <div className="w-full flex justify-center h-[60vh]">
          <DataChart stats={userData} />
        </div>
      )}
    </div>
  );
};

export default index;
