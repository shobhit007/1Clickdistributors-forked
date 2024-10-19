import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import moment from "moment";
import { convertTimeStamp } from "@/lib/commonFunctions";
import { toast } from "react-toastify";

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

const BusinessDetails = ({ data }) => {
  const {
    leadData,
    leadDetails: { business },
  } = data;

  const [edit, setEdit] = useState(false);
  const [fields, setFields] = useState({
    establishYear: business?.establishYear || "",
    businessNature: business?.businessNature || "",
    turnOver: business?.turnOver || "",
    state: business?.state || "",
    address: business?.address || "",
    country: business?.country || "",
    gstNumber: business?.gstNumber || "",
    website: business?.website || "",
    onlineLink1: business?.onlineLink1 || "",
    onlineLink2: business?.onlineLink2 || "",
    onlineLink3: business?.onlineLink3 || "",
    onlineLink4: business?.onlineLink4 || "",
    facebook: business?.facebook || "",
    insta: business?.insta || "",
    linkedIn: business?.linkedIn || "",
    youtube: business?.youtube || "",
    quora: business?.quora || "",
    profileScore: business?.profileScore || "",
    profileStatus: business?.profileStatus || "",
    companyType: business?.companyType || "",
    aboutCompany: business?.aboutCompany || "",
    pincode: business?.pincode || "",
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

  const addBusinessDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/updateBusinessDetails`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...fields, leadId: leadData?.leadId }),
      });

      const result = await response.json();
      if (result.success) {
        setEdit(false);
        toast.success(result.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("error in update business details", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full">
      <button
        className="bg-gray-200 py-1 px-2 absolute top-0 right-4"
        onClick={toggleEdit}
      >
        <MdEdit className="text-gray-700 text-3xl" />
      </button>
      <div className="p-4">
        <div className="flex items-start gap-4">
          <LeftBox>
            <label
              htmlFor="companyName"
              className=" text-gray-700 font-semibold nowrap"
            >
              Company Name:
            </label>
          </LeftBox>
          <RightBox>
            <p className="text-base text-gray-700">{leadData?.company_name}</p>
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="profileId"
              className=" text-gray-700 font-semibold nowrap"
            >
              Unique Profile Id:
            </label>
          </LeftBox>
          <RightBox>
            <p className="text-base text-gray-700">{leadData?.profileId}</p>
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="profileScore"
              className=" text-gray-700 font-semibold nowrap"
            >
              Profile Score:
            </label>
          </LeftBox>
          <RightBox>
            <select
              disabled={!edit}
              className={`border p-2 rounded-md border-gray-400 w-full md:w-full`}
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
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="createdAt"
              className=" text-gray-700 font-semibold nowrap"
            >
              Lead Creation Date:
            </label>
          </LeftBox>
          <RightBox>
            <p className="text-base text-gray-700">
              {convertTimeStamp(leadData?.createdAt)}
            </p>
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="source"
              className=" text-gray-700 font-semibold nowrap"
            >
              Lead Source:
            </label>
          </LeftBox>
          <RightBox>
            <p className="text-base text-gray-700">{leadData?.source}</p>
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="profileStatus"
              className=" text-gray-700 font-semibold nowrap"
            >
              Profile Status:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="number"
              id="profileStatus"
              name="profileStatus"
              value={fields.profileStatus}
              onChange={handleChange}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="aboutCompany"
              className=" text-gray-700 font-semibold nowrap"
            >
              About Company:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="aboutCompany"
              name="aboutCompany"
              value={fields.aboutCompany}
              onChange={handleChange}
              placeholder="About Company"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="companyType"
              className=" text-gray-700 font-semibold nowrap"
            >
              Company Type:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="companyType"
              name="companyType"
              value={fields.companyType}
              onChange={handleChange}
              placeholder="Enter Company Type"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="establishYear"
              className=" text-gray-700 font-semibold nowrap"
            >
              Establishment Year:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="number"
              id="establishYear"
              name="establishYear"
              value={fields.establishYear}
              onChange={handleChange}
              placeholder="Enter Establishment Year"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="businessNature"
              className=" text-gray-700 font-semibold nowrap"
            >
              Nature Of Business:
            </label>
          </LeftBox>
          <RightBox>
            <select
              disabled={!edit}
              className={`border p-2 rounded-md border-gray-400 w-full md:w-full`}
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
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="turnOver"
              className=" text-gray-700 font-semibold nowrap"
            >
              Turn Over:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="number"
              id="turnOver"
              name="turnOver"
              value={fields.turnOver}
              onChange={handleChange}
              placeholder="Enter Turn Over"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="city"
              className=" text-gray-700 font-semibold nowrap"
            >
              City:
            </label>
          </LeftBox>
          <RightBox>
            <p className="text-base text-gray-800" id="city">
              {leadData?.city}
            </p>
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="state"
              className=" text-gray-700 font-semibold nowrap"
            >
              State:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="state"
              name="state"
              value={fields.state}
              onChange={handleChange}
              placeholder="Enter State"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="address"
              className=" text-gray-700 font-semibold nowrap"
            >
              Address:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="address"
              name="address"
              value={fields.address}
              onChange={handleChange}
              placeholder="Enter Address"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="pincode"
              className=" text-gray-700 font-semibold nowrap"
            >
              Pincode:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="number"
              id="pincode"
              name="pincode"
              value={fields.pincode}
              onChange={handleChange}
              placeholder="Enter Pincode"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="country"
              className=" text-gray-700 font-semibold nowrap"
            >
              Country:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="country"
              name="country"
              value={fields.country}
              onChange={handleChange}
              placeholder="Enter Country"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="gstNumber"
              className=" text-gray-700 font-semibold nowrap"
            >
              GST Number:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="gstNumber"
              name="gstNumber"
              value={fields.gstNumber}
              onChange={handleChange}
              placeholder="Enter GST Number"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="phone"
              className=" text-gray-700 font-semibold nowrap"
            >
              Phone Number:
            </label>
          </LeftBox>
          <RightBox>
            <p className="text-base text-gray-700" id="phone">
              {leadData?.phone_number}
            </p>
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="employeeCount"
              className=" text-gray-700 font-semibold nowrap"
            >
              Employee Count:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="number"
              id="employeeCount"
              name="employeeCount"
              value={fields.employeeCount}
              placeholder="Employee Count"
              onChange={handleChange}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="onlineLink1"
              className=" text-gray-700 font-semibold nowrap"
            >
              Online Link - 1:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="onlineLink1"
              name="onlineLink1"
              value={fields.onlineLink1}
              onChange={handleChange}
              placeholder="Online Link - 1"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="onlineLink2"
              className=" text-gray-700 font-semibold nowrap"
            >
              Online Link - 2:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="onlineLink2"
              name="onlineLink2"
              value={fields.onlineLink2}
              onChange={handleChange}
              placeholder="Online Link - 2"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="onlineLink3"
              className=" text-gray-700 font-semibold nowrap"
            >
              Online Link - 3:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="onlineLink3"
              name="onlineLink3"
              value={fields.onlineLink3}
              onChange={handleChange}
              placeholder="Online Link - 3"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="onlineLink4"
              className=" text-gray-700 font-semibold nowrap"
            >
              Online Link - 4:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="onlineLink4"
              name="onlineLink4"
              placeholder="Online Link - 4"
              value={fields.onlineLink4}
              onChange={handleChange}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="website"
              className=" text-gray-700 font-semibold nowrap"
            >
              Website:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="website"
              name="website"
              value={fields.website}
              onChange={handleChange}
              placeholder="Website URL"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="facebook"
              className=" text-gray-700 font-semibold nowrap"
            >
              Facebook:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="facebook"
              name="facebook"
              value={fields.facebook}
              placeholder="Facebook ID"
              onChange={handleChange}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="insta"
              className=" text-gray-700 font-semibold nowrap"
            >
              Insta:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="insta"
              name="insta"
              value={fields.insta}
              onChange={handleChange}
              placeholder="Insta ID"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="linkedIn"
              className=" text-gray-700 font-semibold nowrap"
            >
              LinkedIn:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="linkedIn"
              name="linkedIn"
              value={fields.linkedIn}
              placeholder="LinkedIn ID"
              onChange={handleChange}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="youtube"
              className=" text-gray-700 font-semibold nowrap"
            >
              Youtube:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="youtube"
              name="youtube"
              value={fields.youtube}
              onChange={handleChange}
              placeholder="Youtube Channel"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <div className="flex items-start gap-4 mt-4">
          <LeftBox>
            <label
              htmlFor="quora"
              className=" text-gray-700 font-semibold nowrap"
            >
              Quora:
            </label>
          </LeftBox>
          <RightBox>
            <input
              disabled={!edit}
              type="text"
              id="quora"
              name="quora"
              value={fields.quora}
              onChange={handleChange}
              placeholder="Quora Profile"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none w-full"
              }`}
            />
          </RightBox>
        </div>
        <button
          disabled={!edit}
          className={`mt-8 bg-colorPrimary text-white p-2 rounded-md w-full max-w-52 ${
            edit ? "opacity-100" : "opacity-70"
          }`}
          onClick={addBusinessDetails}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const LeftBox = ({ children }) => {
  return <div className="w-40 text-left">{children}</div>;
};
const RightBox = ({ children }) => {
  return (
    <div className="flex-1 text-left">
      <div className="max-w-72">{children}</div>
    </div>
  );
};

export default BusinessDetails;
