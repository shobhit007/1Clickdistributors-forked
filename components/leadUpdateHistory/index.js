import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useState } from "react";
import { MdRefresh } from "react-icons/md";
import { toast } from "react-toastify";

export const convertTimeStampToDate = (time) => {
  if (!time?._seconds) {
    return null;
  }

  let dt = new Date(time._seconds * 1000);

  return moment(dt).format("DD-MM-YYYY hh:mm A");
};

const index = ({ leadId, close }) => {
  const [loading, setLoading] = useState(false);

  const getLeadUpdateHistory = async () => {
    try {
      if (!leadId) return null;
      const token = localStorage.getItem("authToken");
      setLoading(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getUpdateHistoryOfLead`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ leadId }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.success && data.data) {
        return data.data;
      } else {
        toast.error(data.message || "couldn't find sales managers");
        return null;
      }
    } catch (error) {
      setLoading(false);
      console.log("error in getting lead updatehistory", error.message);
      toast.error(error.message);
      return null;
    }
  };

  // const { data: salesMembers, refetch } = useQuery({

  const { data: updateHistory, refetch } = useQuery({
    queryKey: ["leadUpdateHistory", leadId],
    queryFn: getLeadUpdateHistory,
  });

  console.log("updateHistory", updateHistory);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <img src="/loader.gif" className="h-[30px] w-auto" alt="loading" />
        <p className="text-xl font-bold text-gray-500 mt-3">
          Loading update history... please wait
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {updateHistory?.length == 0 ? (
        <h1 className="text-lg text-gray-500 mt-4 w-full text-center">
          No update history found for lead id {leadId}
        </h1>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex w-full justify-center gap-2 items-center mt-2">
            <h1 className="text-2xl font-bold mb-2 text-gray-500">
              Update history
            </h1>

            <MdRefresh
              className="text-colorPrimary text-2xl font-bold cursor-pointer"
              onClick={refetch}
            />
          </div>

          {updateHistory?.map((update, index) => {
            return (
              <div className="w-full mt-2 flex flex-wrap gap-1 flex-col text-sm md:text-base">
                <h1 className="text-gray-700 font-semibold bg-colorPrimary/10 px-1 py-[2px] rounded">
                  {index+1}: Updated on: {convertTimeStampToDate(update?.updatedAt)}
                </h1>

                {update?.disposition && (
                  <p className="flex items-center gap-3">
                    <span className="text-gray-600 font-semibold">
                      Disposition:
                    </span>
                    <span className="text-gray-500">{update.disposition}</span>
                  </p>
                )}
                {update?.subDisposition && (
                  <p className="flex items-center gap-3">
                    <span className="text-gray-600 font-semibold">
                      SubDisposition:
                    </span>
                    <span className="text-gray-500">
                      {update.subDisposition}
                    </span>
                  </p>
                )}
                {update?.followUpDate && (
                  <p className="flex items-center gap-3">
                    <span className="text-gray-600 font-semibold">
                      FollowUpDate:
                    </span>
                    <span className="text-gray-500">
                      {convertTimeStampToDate(update?.followUpDate)}
                    </span>
                  </p>
                )}
                {update?.updatedBy && (
                  <p className="flex items-center gap-3">
                    <span className="text-gray-600 font-semibold">
                      Updated By:
                    </span>
                    <span className="text-gray-500">{update?.updatedBy}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default index;
