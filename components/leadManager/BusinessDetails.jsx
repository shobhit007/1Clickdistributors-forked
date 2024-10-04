import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import moment from "moment";

const profiles = [
  "Proprietor",
  "Partnership",
  "Pvt. Ltd.",
  "LTD",
  "LLP",
  "OPC",
  "Farmer Producer Company",
];

const natureOfBusiness = [
  "Manufacturer",
  "Importer",
  "Trader",
  "Supplier",
  "Distributors",
  "Franchiser",
];

const BusinessDetails = () => {
  const [edit, setEdit] = useState(false);
  const [fields, setFields] = useState({
    establishYear: "",
    businessNature: "",
    turnOver: "",
    state: "",
    address: "",
    country: "",
    gst: "",
    employee: "",
    website: "",
    onlineLink1: "",
    onlineLink2: "",
    onlineLink3: "",
    onlineLink4: "",
    facebook: "",
    insta: "",
    linkedIn: "",
    youtube: "",
    quora: "",
    profileScore: "",
    profileStatus: "",
    companyType: "",
    aboutCompany: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    setEdit(!edit);
  };

  return (
    <div className="w-full relative">
      <button
        className="bg-gray-200 py-1 px-2 absolute top-0 right-0"
        onClick={toggleEdit}
      >
        <MdEdit className="text-gray-700 text-3xl" />
      </button>
      <div className="p-4">
        <div className="flex items-center gap-4">
          <label
            htmlFor="companyName"
            className=" text-gray-700 font-semibold nowrap"
          >
            Company Name:
          </label>
          <p className="text-base text-gray-700">Test</p>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label
            htmlFor="profileId"
            className=" text-gray-700 font-semibold nowrap"
          >
            Unique Profile Id:
          </label>
          <p className="text-base text-gray-700">Test</p>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label
            htmlFor="profileScore"
            className=" text-gray-700 font-semibold nowrap"
          >
            Profile Score:
          </label>
          <select
            disabled={!edit}
            className={`border p-2 rounded-md border-gray-400 w-full md:max-w-72`}
            name={"profileScore"}
            value={fields.profileScore}
            onChange={handleChange}
          >
            {profiles?.map((profile, idx) => (
              <option key={idx.toString()} value={profile}>
                {profile}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label
            htmlFor="createdAt"
            className=" text-gray-700 font-semibold nowrap"
          >
            Lead Creation Date:
          </label>
          <p className="text-base text-gray-700">
            {moment().toDate().toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label
            htmlFor="source"
            className=" text-gray-700 font-semibold nowrap"
          >
            Lead Source:
          </label>
          <p className="text-base text-gray-700">facebook</p>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label
            htmlFor="profileStatus"
            className=" text-gray-700 font-semibold nowrap"
          >
            Profile Status:
          </label>
          <input
            disabled={!edit}
            type="number"
            id="profileStatus"
            name="profileStatus"
            value={fields.profileStatus}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label
            htmlFor="aboutCompany"
            className=" text-gray-700 font-semibold nowrap"
          >
            About Company:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="aboutCompany"
            name="aboutCompany"
            value={fields.aboutCompany}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label
            htmlFor="companyType"
            className=" text-gray-700 font-semibold nowrap"
          >
            Company Type:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="companyType"
            name="companyType"
            value={fields.companyType}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label
            htmlFor="establishYear"
            className=" text-gray-700 font-semibold nowrap"
          >
            Establishment Year:
          </label>
          <input
            disabled={!edit}
            type="number"
            id="establishYear"
            name="establishYear"
            value={fields.establishYear}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label
            htmlFor="businessNature"
            className=" text-gray-700 font-semibold nowrap"
          >
            Nature Of Business:
          </label>
          <select
            disabled={!edit}
            className={`border p-2 rounded-md border-gray-400 w-full md:max-w-72`}
            name={"businessNature"}
            value={fields.businessNature}
            onChange={handleChange}
          >
            {natureOfBusiness?.map((nature, idx) => (
              <option key={idx.toString()} value={nature}>
                {nature}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label
            htmlFor="turnOver"
            className=" text-gray-700 font-semibold nowrap"
          >
            Turn Over:
          </label>
          <input
            disabled={!edit}
            type="tel"
            id="turnOver"
            name="turnOver"
            value={fields.turnOver}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label htmlFor="city" className=" text-gray-700 font-semibold nowrap">
            City:
          </label>
          <p className="text-base text-gray-700" id="city">
            Test
          </p>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="state"
            className=" text-gray-700 font-semibold nowrap"
          >
            State:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="state"
            name="state"
            value={fields.state}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="address"
            className=" text-gray-700 font-semibold nowrap"
          >
            Address:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="address"
            name="address"
            value={fields.address}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="pincode"
            className=" text-gray-700 font-semibold nowrap"
          >
            Pincode:
          </label>
          <input
            disabled={!edit}
            type="tel"
            id="pincode"
            name="pincode"
            value={fields.pincode}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="country"
            className=" text-gray-700 font-semibold nowrap"
          >
            Country:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="country"
            name="country"
            value={fields.country}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label htmlFor="gst" className=" text-gray-700 font-semibold nowrap">
            GST Number:
          </label>
          <input
            disabled={!edit}
            type="tel"
            id="gst"
            name="gst"
            value={fields.gst}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="phone"
            className=" text-gray-700 font-semibold nowrap"
          >
            Phone Number:
          </label>
          <p className="text-base text-gray-700" id="phone">
            1234567890
          </p>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="employeeCount"
            className=" text-gray-700 font-semibold nowrap"
          >
            Employee Count:
          </label>
          <input
            disabled={!edit}
            type="tel"
            id="employeeCount"
            name="employeeCount"
            value={fields.employeeCount}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="onlineLink1"
            className=" text-gray-700 font-semibold nowrap"
          >
            Online Link - 1:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="onlineLink1"
            name="onlineLink1"
            value={fields.onlineLink1}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="onlineLink2"
            className=" text-gray-700 font-semibold nowrap"
          >
            Online Link - 2:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="onlineLink2"
            name="onlineLink2"
            value={fields.onlineLink2}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="onlineLink3"
            className=" text-gray-700 font-semibold nowrap"
          >
            Online Link - 3:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="onlineLink3"
            name="onlineLink3"
            value={fields.onlineLink3}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="onlineLink4"
            className=" text-gray-700 font-semibold nowrap"
          >
            Online Link - 4:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="onlineLink4"
            name="onlineLink4"
            value={fields.onlineLink4}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="website"
            className=" text-gray-700 font-semibold nowrap"
          >
            Website:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="website"
            name="website"
            value={fields.website}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="facebook"
            className=" text-gray-700 font-semibold nowrap"
          >
            Facebook:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="facebook"
            name="facebook"
            value={fields.facebook}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="insta"
            className=" text-gray-700 font-semibold nowrap"
          >
            Insta:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="insta"
            name="insta"
            value={fields.insta}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="linkedIn"
            className=" text-gray-700 font-semibold nowrap"
          >
            LinkedIn:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="linkedIn"
            name="linkedIn"
            value={fields.linkedIn}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="youtube"
            className=" text-gray-700 font-semibold nowrap"
          >
            Youtube:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="youtube"
            name="youtube"
            value={fields.youtube}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label
            htmlFor="quora"
            className=" text-gray-700 font-semibold nowrap"
          >
            Quora:
          </label>
          <input
            disabled={!edit}
            type="text"
            id="quora"
            name="quora"
            value={fields.quora}
            onChange={handleChange}
            className={`flex-1 px-3 py-2 ${
              edit &&
              "border border-gray-300 rounded-md focus:outline-none max-w-72"
            }`}
          />
        </div>
        <button
          disabled={!edit}
          className={`mt-8 bg-colorPrimary text-white p-2 rounded-md w-full max-w-52 ${
            edit ? "opacity-100" : "opacity-70"
          }`}
          onClick={() => {}}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default BusinessDetails;
