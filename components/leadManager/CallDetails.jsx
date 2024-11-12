import React, { useEffect, useState } from "react";
import { dispositions, subDispositions } from "@/lib/data/commonData";
import { MdEdit } from "react-icons/md";
import moment from "moment";
import { toast } from "react-toastify";
import { convertTimeStamp } from "@/lib/commonFunctions";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { authSelector } from "@/store/auth/selector";
import Modal from "../utills/Modal";

const CallDetails = ({ data: leadDetails, refetchLead }) => {
  const userData = useSelector(authSelector);

  const [editCallDetails, setEditCallDetails] = useState(false);
  const [fields, setFields] = useState({
    disposition: "Not Open",
    subDisposition: "",
    followUpDate: "",
    remarks: "",
  });

  useEffect(() => {
    setFields((pre) => ({
      ...fields,
      subDisposition: subDispositions[pre.disposition][0],
    }));
  }, [fields.disposition]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  // Work of today
  const getLeadsUpdateCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/getLeadsStatsToday`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in updateLead", error.message);
      return null;
    }
  };

  const { data: leadsCount, refetch } = useQuery({
    queryKey: ["todayUpdateLeadsCount"],
    queryFn: getLeadsUpdateCount,
  });

  const updateLeadStage = async () => {
    try {
      if (!fields.remarks) {
        toast.error("Please Enter Remarks");
        return;
      }

      if (
        fields.disposition !== "Not Interested" &&
        fields.disposition !== "Become Distributor" &&
        !fields.followUpDate
      ) {
        toast.error("Please select follow up date");
        return;
      }

      const body = {
        leadId: leadDetails?.leadData?.leadId,
        followUpDate: fields.followUpDate,
        disposition: fields.disposition,
        subDisposition: fields.subDisposition,
        remarks: fields.remarks,
      };

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
        refetchLead();
        setEditCallDetails(false);
        setFields({
          disposition: "Not Open",
          subDisposition: "Hot Lead",
          followUpDate: "",
          remarks: "",
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("error in updateLead", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white w-[30%] max-w-[512px] border border-gray-200 overflow-auto p-2 relative">
      {/* show only for sales members */}
      {userData?.hierarchy === "executive" && (
        <LeadsCount leadsCount={leadsCount} refetch={refetch} />
      )}

      <div>
        <h2 className="font-normal text-gray-700 text-center text-2xl mt-2">
          Call Details
        </h2>

        <div className="mt-2 p-4">
          <div className="flex items-start gap-2">
            <div className="flex-1 text-left">
              <label
                htmlFor="name"
                className="text-sm text-gray-700 font-semibold nowrap"
              >
                Name:
              </label>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData?.full_name}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <div className="flex-1 text-left">
              <label
                htmlFor="companyName"
                className=" text-sm text-gray-700 font-semibold nowrap"
              >
                Company Name:
              </label>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData?.company_name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 mt-2">
            <div className="flex-1 text-left">
              <label
                htmlFor="phone"
                className=" text-sm text-gray-700 font-semibold nowrap"
              >
                Contact Number:
              </label>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData?.phone_number ||
                  leadDetails?.leadData?.mobile_number}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <div className="flex-1 text-left">
              <label
                htmlFor="altPhone"
                className=" text-sm text-gray-700 font-semibold nowrap"
              >
                Alt Contact Number:
              </label>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData?.altPhoneNumber || "NA"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <div className="flex-1 text-left">
              <label
                htmlFor="city"
                className=" text-sm text-gray-700 font-semibold nowrap"
              >
                City:
              </label>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData?.city}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <div className="flex-1 text-left">
              <label
                htmlFor="requirement"
                className=" text-sm text-gray-700 font-semibold nowrap"
              >
                Requirement:
              </label>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData[
                  "whats_is_your_requirement_?_write_in_brief"
                ] || "NA"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <div className="flex-1 text-left">
              <label
                htmlFor="disposition"
                className=" text-sm text-gray-700 font-semibold nowrap"
              >
                Disposition:
              </label>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData?.disposition || "NA"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <div className="flex-1 text-left">
              <label
                htmlFor="subDisposition"
                className=" text-sm text-gray-700 font-semibold nowrap"
              >
                Sub-Disposition:
              </label>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData?.subDisposition || "NA"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <div className="flex-1 text-left">
              <label
                htmlFor="lastCallBackDate"
                className=" text-sm text-gray-700 font-semibold nowrap"
              >
                Last Call Back Date:
              </label>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData?.lastCallBackDate
                  ? moment(
                      leadDetails?.leadData.lastCallBackDate
                    ).toLocaleString()
                  : "NA"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <div className="flex-1 text-left">
              <label
                htmlFor="followUpDate"
                className=" text-sm text-gray-700 font-semibold nowrap"
              >
                Next Call Back Date:
              </label>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData?.followUpDate
                  ? convertTimeStamp(leadDetails?.leadData.followUpDate)
                  : "NA"}
              </p>
            </div>
          </div>
          <div className="mt-2 flex gap-4">
            <div className="min-w-fit text-left">
              <label
                htmlFor="remarks"
                className=" text-sm text-gray-700 font-semibold nowrap"
              >
                Remarks:
              </label>
            </div>
            <div className="flex-1 items-start justify-start">
              <p className="text-base text-gray-700">
                {leadDetails?.leadData?.remarks || "NA"}
              </p>
            </div>
          </div>
          <button
            className={`mt-8 bg-colorPrimary text-white p-2 rounded-md w-full`}
            onClick={() => setEditCallDetails(true)}
          >
            Update
          </button>
        </div>
      </div>
      {editCallDetails && (
        <Modal>
          <div className="bg-white w-full max-w-lg border border-gray-200 overflow-auto py-2 px-6 relative">
            <button
              className="absolute right-0 top-0 bg-red-600 text-white text-sm px-3 py-1"
              onClick={() => setEditCallDetails(false)}
            >
              close
            </button>

            <div className="mt-4">
              {/* Remarks Textarea */}
              <div className="mb-4">
                <label
                  htmlFor="remarks"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  id="remarks"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  rows="4"
                  placeholder="Enter your remarks here"
                  value={fields.remarks}
                  onChange={handleChange}
                />
              </div>

              {/* Row for Disposition, Sub-disposition, and Follow-up Date */}
              <div className="flex flex-wrap -mx-2">
                {/* Disposition Select */}
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="disposition"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Disposition
                  </label>
                  <select
                    name="disposition"
                    id="disposition"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={fields.disposition}
                    onChange={handleChange}
                  >
                    {dispositions.map((disposition) => (
                      <option key={disposition} value={disposition}>
                        {disposition}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-disposition Select */}
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="subDisposition"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sub-disposition
                  </label>
                  <select
                    name="subDisposition"
                    id="subDisposition"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={fields.subDisposition}
                    onChange={handleChange}
                  >
                    {subDispositions[fields.disposition].map((subDis) => (
                      <option key={subDis} value={subDis}>
                        {subDis}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Follow-up Date Input */}
                <div className="w-full md:w-1/3 px-2">
                  <label
                    htmlFor="followUpDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Follow-up Date
                  </label>
                  <input
                    name="followUpDate"
                    type="datetime-local"
                    id="followUpDate"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-6 flex w-full justify-end">
                  <button
                    onClick={updateLeadStage}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const LeadsCount = ({ leadsCount, refetch }) => {
  return (
    <div className="mt-4 border-b-1 border-gray-200 relative">
      <button className="absolute left-0 top-0" onClick={refetch}>
        Refresh
      </button>
      <div className="flex gap-4 mt-8">
        <div className="flex-1 py-4 rounded">
          <div className="text-center">
            <h4 className="font-normal text-gray-700 text-center text-lg mt-4">
              Total Leads
            </h4>
            <h2 className="font-semibold text-gray-700 text-center text-2xl mt-4">
              {leadsCount ? leadsCount?.totalLeadsAssigned : "NA"}
            </h2>
          </div>
        </div>
        <div className="flex-1 py-4 rounded">
          <div className="text-center">
            <h4 className="font-normal text-gray-700 text-center text-lg mt-4">
              Today Worked
            </h4>
            <h2 className="font-semibold text-gray-700 text-center text-2xl mt-4">
              {leadsCount ? leadsCount?.leadsUpdatedToday : "NA"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDetails;
