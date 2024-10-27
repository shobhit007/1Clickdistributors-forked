import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import moment from "moment";
import { designations } from "@/lib/data/commonData";
import { toast } from "react-toastify";

const ContactDetails = ({ data: lead }) => {
  const leadDetails = lead?.leadDetails?.contact?.details;
  const leadOfficeDetails = lead?.leadDetails?.contact?.officeDetails;
  const leadAltContactDetails = lead?.leadDetails?.contact?.altContactDetails;

  const [edit, setEdit] = useState(false);
  const [details, setDetails] = useState({
    designation: leadDetails?.designation || "",
    altPhoneNumber: leadDetails?.altPhoneNumber || "",
    contactNumber_3: leadDetails?.contactNumber_3 || "",
    contactNumber_4: leadDetails?.contactNumber_4 || "",
    email_1: leadDetails?.email_1 || "",
    email_2: leadDetails?.email_2 || "",
  });

  const [officeContact, setOfficeContact] = useState({
    name: leadOfficeDetails?.name || "",
    designation: leadOfficeDetails?.designation || "",
    phone_number: leadOfficeDetails?.phone_number || "",
    altPhoneNumber: leadOfficeDetails?.altPhoneNumber || "",
    email_1: leadOfficeDetails?.email_1 || "",
    email_2: leadOfficeDetails?.email_2 || "",
    address: leadOfficeDetails?.address || "",
  });

  const [altContact, setAltContact] = useState({
    name: leadAltContactDetails?.name || "",
    designation: leadAltContactDetails?.designation || "",
    phone_number: leadAltContactDetails?.phone_number || "",
    altPhoneNumber: leadAltContactDetails?.altPhoneNumber || "",
    email_1: leadAltContactDetails?.email_1 || "",
    email_2: leadAltContactDetails?.email_2 || "",
    address: leadAltContactDetails?.address || "",
  });

  useEffect(() => {
    setDetails((pre) => ({ ...pre, designation: designations[0] }));
    setAltContact((pre) => ({ ...pre, designation: designations[0] }));
    setOfficeContact((pre) => ({ ...pre, designation: designations[0] }));
  }, []);

  const toggleEdit = () => setEdit(!edit);

  const onChangeDetails = (e) => {
    const { name, value } = e.target;
    setDetails((pre) => ({ ...pre, [name]: value }));
  };
  const onChangeAltContact = (e) => {
    const { name, value } = e.target;
    setAltContact((pre) => ({ ...pre, [name]: value }));
  };
  const onChangeOfficeContact = (e) => {
    const { name, value } = e.target;
    setOfficeContact((pre) => ({ ...pre, [name]: value }));
  };

  const updateContactDetails = async () => {
    try {
      if (!lead?.leadData?.leadId) {
        toast.error("Something went wrong");
        return;
      }
      const body = {
        contactDetails: {
          details,
          officeDetails: officeContact,
          altContactDetails: altContact,
        },
      };

      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/contactDetails`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...body, leadId: lead?.leadData?.leadId }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setEdit(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("error in contact details", error.message);
      toast.error(error.message);
    }
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
        {/* contact details */}
        <div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="companyName"
              className=" text-gray-700 font-semibold nowrap"
            >
              Name:
            </label>
            <p className="text-base text-gray-700">
              {lead?.leadData?.full_name}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label
              htmlFor="designation"
              className=" text-gray-700 font-semibold nowrap"
            >
              Designation:
            </label>
            <select
              disabled={!edit}
              className={`border p-2 rounded-md border-gray-400 w-full md:max-w-72`}
              name={"designation"}
              value={details.designation}
              onChange={onChangeDetails}
            >
              {designations?.map((designantion, idx) => (
                <option key={idx.toString()} value={designantion}>
                  {designantion}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label
              htmlFor="contactNumber"
              className=" text-gray-700 font-semibold nowrap"
            >
              Contact Number:
            </label>
            <p className="text-base text-gray-700">
              {lead?.leadData?.phone_number}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="altPhoneNumber"
              className=" text-gray-700 font-semibold nowrap"
            >
              Alt Contact Number:
            </label>
            <input
              disabled={!edit}
              type="number"
              id="altPhoneNumber"
              name="altPhoneNumber"
              value={details.altPhoneNumber}
              onChange={onChangeDetails}
              placeholder="Enter Alternative phone"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="contactNumber_3"
              className=" text-gray-700 font-semibold nowrap"
            >
              Contact Number-3:
            </label>
            <input
              disabled={!edit}
              type="number"
              id="contactNumber_3"
              name="contactNumber_3"
              value={details.contactNumber_3}
              onChange={onChangeDetails}
              placeholder="Enter Contact Number-3"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="contactNumber_4"
              className=" text-gray-700 font-semibold nowrap"
            >
              Contact Number-4:
            </label>
            <input
              disabled={!edit}
              type="number"
              id="contactNumber_4"
              name="contactNumber_4"
              value={details.contactNumber_4}
              placeholder="Enter Contact Number-4"
              onChange={onChangeDetails}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="email_1"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-1:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="email_1"
              name="email_1"
              value={details.email_1}
              onChange={onChangeDetails}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="example@gmail.com"
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="email_2"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-2:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="email_2"
              name="email_2"
              value={details.email_2}
              onChange={onChangeDetails}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="example@gmail.com"
            />
          </div>
        </div>
        <div className="mt-4 md:mt-6">
          <h3 className="text-black text-lg md:text-xl font-bold">
            Alternative Contact Details
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="name"
              className=" text-gray-700 font-semibold nowrap"
            >
              Name:
            </label>
            <input
              disabled={!edit}
              type="text"
              id="name"
              name="name"
              value={altContact.name}
              onChange={onChangeAltContact}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="Enter Name"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label
              htmlFor="designation"
              className=" text-gray-700 font-semibold nowrap"
            >
              Designation:
            </label>
            <select
              disabled={!edit}
              className={`border p-2 rounded-md border-gray-400 w-full md:max-w-72`}
              name={"designation"}
              value={altContact.designation}
              onChange={onChangeAltContact}
            >
              {designations?.map((designantion, idx) => (
                <option key={idx.toString()} value={designantion}>
                  {designantion}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label
              htmlFor="address"
              className=" text-gray-700 font-semibold nowrap"
            >
              Office Address:
            </label>
            <input
              disabled={!edit}
              type="text"
              id="address"
              name="address"
              value={altContact.address}
              onChange={onChangeAltContact}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="office address"
            />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label
              htmlFor="phone_number"
              className=" text-gray-700 font-semibold nowrap"
            >
              Contact Number:
            </label>
            <input
              disabled={!edit}
              type="number"
              id="phone_number"
              name="phone_number"
              value={altContact.phone_number}
              onChange={onChangeAltContact}
              placeholder="Enter phone number"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="altPhoneNumber"
              className=" text-gray-700 font-semibold nowrap"
            >
              Alt Contact Number:
            </label>
            <input
              disabled={!edit}
              type="number"
              id="altPhoneNumber"
              name="altPhoneNumber"
              value={altContact.altPhoneNumber}
              onChange={onChangeAltContact}
              placeholder="Enter Alternative phone"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="email_1"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-1:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="email_1"
              name="email_1"
              value={altContact.email_1}
              onChange={onChangeAltContact}
              placeholder="example@gmail.com"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="email_2"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-2:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="email_2"
              name="email_2"
              value={altContact.email_2}
              onChange={onChangeAltContact}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="example@gmail.com"
            />
          </div>
        </div>
        {/* office contace details */}
        <div className="mt-4 md:mt-6">
          <h3 className="text-black text-lg md:text-xl font-bold">
            Office contact
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="name"
              className=" text-gray-700 font-semibold nowrap"
            >
              Name:
            </label>
            <input
              disabled={!edit}
              type="text"
              id="name"
              name="name"
              value={officeContact.name}
              onChange={onChangeOfficeContact}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="Enter Name"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label
              htmlFor="designation"
              className=" text-gray-700 font-semibold nowrap"
            >
              Designation:
            </label>
            <select
              disabled={!edit}
              className={`border p-2 rounded-md border-gray-400 w-full md:max-w-72`}
              name={"designation"}
              value={officeContact.designation}
              onChange={onChangeOfficeContact}
            >
              {designations?.map((designantion, idx) => (
                <option key={idx.toString()} value={designantion}>
                  {designantion}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label
              htmlFor="address"
              className=" text-gray-700 font-semibold nowrap"
            >
              Office Address:
            </label>
            <input
              disabled={!edit}
              type="text"
              id="address"
              name="address"
              value={officeContact.address}
              onChange={onChangeOfficeContact}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="Office address"
            />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label
              htmlFor="phone_number"
              className=" text-gray-700 font-semibold nowrap"
            >
              Contact Number:
            </label>
            <input
              disabled={!edit}
              type="number"
              id="phone_number"
              name="phone_number"
              value={officeContact.phone_number}
              onChange={onChangeOfficeContact}
              placeholder="Enter phone number"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="altPhoneNumber"
              className=" text-gray-700 font-semibold nowrap"
            >
              Alt Contact Number:
            </label>
            <input
              disabled={!edit}
              type="tel"
              id="altPhoneNumber"
              name="altPhoneNumber"
              value={officeContact.altPhoneNumber}
              onChange={onChangeOfficeContact}
              placeholder="Enter Alternative phone"
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="email_1"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-1:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="email_1"
              name="email_1"
              value={officeContact.email_1}
              onChange={onChangeOfficeContact}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="example@gmail.com"
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="email_2"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-2:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="email_2"
              name="email_2"
              value={officeContact.email_2}
              onChange={onChangeOfficeContact}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="example@gmail.com"
            />
          </div>
        </div>

        <button
          disabled={!edit}
          className={`mt-8 bg-colorPrimary text-white p-2 rounded-md w-full max-w-52 ${
            edit ? "opacity-100" : "opacity-70"
          }`}
          onClick={updateContactDetails}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ContactDetails;
