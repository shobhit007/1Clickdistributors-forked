import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import DataChart from "./dataChart";
import moment from "moment";
import { useSelector } from "react-redux";
import { authSelector } from "@/store/auth/selector";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [date, setDate] = useState(null);
  const [userData, setUserData] = useState(null);
  const [executiveWiseRecord, setExecutiveWiseRecord] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [memberId, setMemberId] = useState("");

  const currentLoggedInUser = useSelector(authSelector);

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
          memberId: memberId || null,
        }),
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        return data;
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
    queryKey: ["userUpdateData", date, memberId],
    queryFn: getUserDataForDashboard,
  });

  // Process the fetched data
  useEffect(() => {
    if (Array.isArray(data?.leads) && data.leads.length > 0) {
      const dispositionCounts = {};
      const formattedData = {};
      const membersData = data.membersData;

      // Aggregate dispositions per sales executive
      data.leads.forEach((lead) => {
        if (lead.disposition) {
          // Overall disposition counts
          dispositionCounts[lead.disposition] =
            (dispositionCounts[lead.disposition] || 0) + 1;

          const { salesExecutiveName, disposition } = lead;

          // Initialize sales executive data if not present
          if (!formattedData[salesExecutiveName]) {
            formattedData[salesExecutiveName] = {
              salesExecutiveName,
              totalUpdates: 0,
            };
          }

          // Increment total updates and specific disposition
          formattedData[salesExecutiveName].totalUpdates += 1;
          formattedData[salesExecutiveName][disposition] =
            (formattedData[salesExecutiveName][disposition] || 0) + 1;
        }
      });

      // Aggregate dispositions for managers by adding their executives' data
      Object.keys(formattedData).forEach((memberName) => {
        const member = membersData.find((m) => m.name === memberName);
        if (member?.hierarchy === "manager") {
          // Find all executives under this manager
          const managerExecutives = membersData.filter(
            (m) => m.senior === member.id
          );
          const managerData = formattedData[memberName];

          // Initialize manager's dispositions if not present
          const aggregatedDispositions = { ...managerData };

          managerExecutives.forEach((executive) => {
            const executiveData = formattedData[executive.name];
            if (executiveData) {
              // Iterate over each key in executiveData
              Object.keys(executiveData).forEach((key) => {
                if (key === "salesExecutiveName" || key === "totalUpdates") {
                  // Skip non-disposition keys
                  return;
                }
                // Add executive's disposition count to manager's dispositions
                aggregatedDispositions[key] =
                  (aggregatedDispositions[key] || 0) + executiveData[key];
              });
              // Add executive's total updates to manager's total updates
              aggregatedDispositions.totalUpdates += executiveData.totalUpdates;
            }
          });

          // Update the manager's data in formattedData
          formattedData[memberName] = aggregatedDispositions;
        }
      });

      setExecutiveWiseRecord(formattedData);
      setUserData(dispositionCounts);
    } else {
      setUserData(null);
      setExecutiveWiseRecord({});
    }
  }, [data?.leads, data?.membersData]);

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
    setMemberId(selectedMember);
  };

  return (
    <div className="w-full h-auto p-3 pb-10">
      {loading && (
        <div className="w-full flex justify-center my-1">
          <img src="/loader.gif" className="h-12 w-auto" />
        </div>
      )}

      <div className="flex gap-2 items-end py-1 px-3 rounded-md flex-wrap my-2 mb-6">
        <div className="flex flex-row gap-1 items-center">
          <span className="text-[12px] text-gray-500">From</span>
          <input
            type="date"
            className="text-[12px] border border-gray-600 rounded px-2"
            value={selectedStartDate}
            onChange={(e) => setSelectedStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-1 items-center">
          <span className="text-[12px] text-gray-500">To</span>
          <input
            type="date"
            className="text-[12px] border border-gray-600 rounded px-2"
            value={selectedEndDate}
            onChange={(e) => setSelectedEndDate(e.target.value)}
          />
        </div>
        {currentLoggedInUser?.hierarchy !== "executive" && (
          <select
            className="text-[12px] border border-gray-600 rounded px-2 py-1"
            onChange={(e) => setSelectedMember(e.target.value)}
            value={selectedMember}
          >
            <option value="">Select Name</option>
            {data?.membersData?.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={handleSetDate}
          className="text-white bg-blue-500 px-2 py-1 rounded-md text-xs"
        >
          Search
        </button>
      </div>

      {!userData && (!data?.leads || data?.leads?.length === 0) && !loading && (
        <h1 className="text-gray-600 font-semibold text-xl w-full text-center">
          Looks like no leads updated within selected time range
        </h1>
      )}
      {userData && (
        <div className="w-full flex justify-center h-[60vh]">
          <DataChart stats={userData} />
        </div>
      )}

      {userData && executiveWiseRecord && (
        <div className="w-full flex mt-5 justify-center">
          <div className="overflow-x-auto w-[95%]">
            <table className="min-w-full bg-white border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Sales Executive Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Total Updates
                  </th>
                  {Object.keys(userData).map((disposition) => (
                    <th
                      key={disposition}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {disposition}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.values(executiveWiseRecord).map(
                  (salesExecutive, index) => (
                    <tr key={index} className="bg-white even:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">
                        {salesExecutive.salesExecutiveName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {salesExecutive.totalUpdates}
                      </td>
                      {Object.keys(userData).map((disposition) => (
                        <td
                          key={disposition}
                          className="border border-gray-300 px-4 py-2"
                        >
                          {salesExecutive[disposition] || 0}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
