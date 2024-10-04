import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import moment from "moment";
import { designations } from "@/lib/data/commonData";

const ContactDetails = () => {
  const [edit, setEdit] = useState(false);

  const toggleEdit = () => setEdit(!edit);
  //Proprietor, Partnership, Pvt. Ltd., LTD, LLP, OPC, Farmer Producer Company
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
            <p className="text-base text-gray-700">Test</p>
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
            <p className="text-base text-gray-700">1234567890</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="altPhone"
              className=" text-gray-700 font-semibold nowrap"
            >
              Alt Contact Number:
            </label>
            <input
              disabled={!edit}
              type="tel"
              id="altPhone"
              name="altPhone"
              value={"123456789"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="altPhone3"
              className=" text-gray-700 font-semibold nowrap"
            >
              Contact Number-3:
            </label>
            <input
              disabled={!edit}
              type="tel"
              id="altPhone3"
              name="altPhone3"
              value={"123456789"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="altPhone4"
              className=" text-gray-700 font-semibold nowrap"
            >
              Contact Number-4:
            </label>
            <input
              disabled={!edit}
              type="tel"
              id="altPhone4"
              name="altPhone4"
              value={"123456789"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="mail1"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-1:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="mail1"
              name="mail1"
              value={"example@gmail.com"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="example@gmail.com"
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="mail2"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-2:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="mail2"
              name="mail2"
              value={"example@gmail.com"}
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
              htmlFor="companyName"
              className=" text-gray-700 font-semibold nowrap"
            >
              Name:
            </label>
            <p className="text-base text-gray-700">Test</p>
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
              value={"test"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="office address"
            />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label
              htmlFor="address"
              className=" text-gray-700 font-semibold nowrap"
            >
              Contact Number:
            </label>
            <p className="text-base text-gray-700">1234567890</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="altPhone"
              className=" text-gray-700 font-semibold nowrap"
            >
              Alt Contact Number:
            </label>
            <input
              disabled={!edit}
              type="tel"
              id="altPhone"
              name="altPhone"
              value={"123456789"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="mail1"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-1:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="mail1"
              name="mail1"
              value={"example@gmail.com"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="example@gmail.com"
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="mail2"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-2:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="mail2"
              name="mail2"
              value={"example@gmail.com"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="example@gmail.com"
            />
          </div>
        </div>
        {/* Alternate contace details */}
        <div className="mt-4 md:mt-6">
          <h3 className="text-black text-lg md:text-xl font-bold">
            Alternative Contact Details
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="companyName"
              className=" text-gray-700 font-semibold nowrap"
            >
              Name:
            </label>
            <p className="text-base text-gray-700">Test</p>
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
              value={"test"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="office address"
            />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label
              htmlFor="address"
              className=" text-gray-700 font-semibold nowrap"
            >
              Contact Number:
            </label>
            <p className="text-base text-gray-700">1234567890</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="altPhone"
              className=" text-gray-700 font-semibold nowrap"
            >
              Alt Contact Number:
            </label>
            <input
              disabled={!edit}
              type="tel"
              id="altPhone"
              name="altPhone"
              value={"123456789"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="mail1"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-1:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="mail1"
              name="mail1"
              value={"example@gmail.com"}
              className={`flex-1 px-3 py-2 ${
                edit &&
                "border border-gray-300 rounded-md focus:outline-none md:max-w-72"
              }`}
              placeholder="example@gmail.com"
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="mail2"
              className=" text-gray-700 font-semibold nowrap"
            >
              Mail-2:
            </label>
            <input
              disabled={!edit}
              type="email"
              id="mail2"
              name="mail2"
              value={"example@gmail.com"}
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
          onClick={() => {}}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ContactDetails;
