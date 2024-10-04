import React, { useEffect, useState } from "react";
import {
  designations,
  dispositions,
  subDispositions,
} from "@/lib/data/commonData";
import { MdEdit } from "react-icons/md";

const CallDetails = ({ data }) => {
  const { leadData } = data;

  const [editCallDetails, setEditCallDetails] = useState(false);
  const [fields, setFields] = useState({
    altPhoneNumber: leadData?.altPhoneNumber || "",
    designantion: leadData?.designation || "",
    query: leadData?.query || "",
    disposition: leadData?.disposition || "",
    subDisposition: leadData?.sub_disposition || "",
  });

  const toggleEditCallDetails = () => {
    setEditCallDetails(!editCallDetails);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  return (
    <div className="bg-white w-[30%] max-w-[512px] border border-gray-200 overflow-auto p-2 relative">
      <button
        className="bg-gray-200 absolute right-0 top-0 py-1 px-2"
        onClick={toggleEditCallDetails}
      >
        <MdEdit className="text-gray-700 text-3xl" />
      </button>
      <h2 className="font-normal text-gray-700 text-center text-2xl mt-4">
        Call Details
      </h2>
      <div className="mt-4 p-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="companyName"
            className=" text-gray-700 font-semibold nowrap"
          >
            Company Name:
          </label>
          {/* <input
            disabled={!editCallDetails}
            type="text"
            id="companyName"
            name="companyName"
            value={"test"}
            className={`flex-1 px-3 py-2 ${
              editCallDetails &&
              "border border-gray-300 rounded-md focus:outline-none"
            }`}
          /> */}
          <p className="text-base text-gray-700">{leadData?.company_name}</p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label htmlFor="name" className=" text-gray-700 font-semibold nowrap">
            Name:
          </label>
          {/* <input
            disabled={!editCallDetails}
            type="text"
            id="name"
            name="name"
            value={"test"}
            className={`flex-1 px-3 py-2 ${
              editCallDetails &&
              "border border-gray-300 rounded-md focus:outline-none"
            }`}
          /> */}
          <p className="text-base text-gray-700">{leadData?.full_name}</p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label
            htmlFor="designation"
            className=" text-gray-700 font-semibold nowrap"
          >
            Designation:
          </label>
          <select
            disabled={!editCallDetails}
            className={`border p-2 rounded-md border-gray-400 w-full`}
            name={"designation"}
          >
            {designations?.map((designantion, idx) => (
              <option key={idx.toString()} value={designantion}>
                {designantion}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label
            htmlFor="phone"
            className=" text-gray-700 font-semibold nowrap"
          >
            Contact Number:
          </label>
          {/* <input
            disabled={!editCallDetails}
            type="tel"
            id="phone"
            name="phone"
            value={"123456789"}
            className={`flex-1 px-3 py-2 ${
              editCallDetails &&
              "border border-gray-300 rounded-md focus:outline-none"
            }`}
          /> */}
          <p className="text-base text-gray-700">
            {leadData?.phone_number || leadData.mobile_number}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label
            htmlFor="altPhone"
            className=" text-gray-700 font-semibold nowrap"
          >
            Alt Contact Number:
          </label>
          {/* <input
            disabled={!editCallDetails}
            type="tel"
            id="altPhone"
            name="altPhone"
            value={"123456789"}
            className={`flex-1 px-3 py-2 ${
              editCallDetails &&
              "border border-gray-300 rounded-md focus:outline-none"
            }`}
          /> */}
          <p className="text-base text-gray-700">
            {leadData?.altPhoneNumber || "NA"}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label htmlFor="city" className=" text-gray-700 font-semibold nowrap">
            City:
          </label>
          {/* <input
            disabled={!editCallDetails}
            type="text"
            id="city"
            name="city"
            value={"test"}
            className={`flex-1 px-3 py-2 ${
              editCallDetails &&
              "border border-gray-300 rounded-md focus:outline-none"
            }`}
          /> */}
          <p className="text-base text-gray-700">{leadData?.city}</p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label
            htmlFor="query"
            className=" text-gray-700 font-semibold nowrap"
          >
            Query:
          </label>
          {/* <input
            disabled={!editCallDetails}
            type="text"
            id="query"
            name="query"
            value={"test"}
            className={`flex-1 px-3 py-2 ${
              editCallDetails &&
              "border border-gray-300 rounded-md focus:outline-none"
            }`}
          /> */}
          <p className="text-base text-gray-700">
            {leadData["whats_is_your_requirement_?_write_in_brief"] ||
              leadData["are_you_in_business_?"] ||
              "NA"}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label
            htmlFor="disposition"
            className=" text-gray-700 font-semibold nowrap"
          >
            Disposition:
          </label>
          <select
            disabled={!editCallDetails}
            className={`border p-2 rounded-md border-gray-400 w-full max-w-72`}
            name="disposition"
            id="disposition"
            value={fields.disposition}
            onChange={handleChange}
          >
            {dispositions?.map((disposition, idx) => (
              <option key={idx.toString()} value={disposition}>
                {disposition}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label
            htmlFor="subDisposition"
            className=" text-gray-700 font-semibold nowrap"
          >
            Sub-Disposition:
          </label>
          <select
            disabled={!editCallDetails}
            className={`border p-2 rounded-md border-gray-400 w-full max-w-72 mt-4`}
            name="subDisposition"
            value={fields.subDisposition}
            onChange={handleChange}
          >
            {subDispositions[fields.disposition]?.map((subDisposition, idx) => (
              <option key={idx.toString()} value={subDisposition}>
                {subDisposition}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label
            htmlFor="lastCallBackDate"
            className=" text-gray-700 font-semibold nowrap"
          >
            Last Call Back Date:
          </label>
          <input
            disabled={!editCallDetails}
            type="datetime-local"
            id="lastCallBackDate"
            name="lastCallBackDate"
            className={`flex-1 px-3 py-2 ${
              editCallDetails &&
              "border border-gray-300 rounded-md focus:outline-none"
            }`}
          />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label
            htmlFor="nextCallBackDate"
            className=" text-gray-700 font-semibold nowrap"
          >
            Next Call Back Date:
          </label>
          <input
            disabled={!editCallDetails}
            type="datetime-local"
            id="nextCallBackDate"
            name="nextCallBackDate"
            className={`flex-1 px-3 py-2 ${
              editCallDetails &&
              "border border-gray-300 rounded-md focus:outline-none"
            }`}
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="remarks"
            className=" text-gray-700 font-semibold nowrap"
          >
            Remarks:
          </label>
          <textarea
            disabled={!editCallDetails}
            id="remarks"
            name="remarks"
            value={"testing..."}
            rows="4"
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter Remarks"
          ></textarea>
        </div>
        <button
          disabled={!editCallDetails}
          className={`mt-8 bg-colorPrimary text-white p-2 rounded-md w-full ${
            editCallDetails ? "opacity-100" : "opacity-70"
          }`}
          onClick={() => {}}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CallDetails;
