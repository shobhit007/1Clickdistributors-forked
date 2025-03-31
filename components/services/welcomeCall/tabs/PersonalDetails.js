import React from "react";

function PersonalDetails({ register, errors }) {
  return (
    <fieldset className="bg-white p-4">
      <legend className="text-lg font-semibold">Personal Details</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            {...register("full_name")}
            placeholder="Full Name"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            {...register("lastName")}
            placeholder="Last Name"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation/Job Title *
          </label>
          <input
            {...register("designation")}
            placeholder="Designation/Job Title"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </label>
          <input
            {...register("mobile")}
            placeholder="Mobile Number"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number
          </label>
          <input
            {...register("whatsAppNumber")}
            placeholder="WhatsApp Number"
            type="number"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            {...register("email", { pattern: /^\S+@\S+$/i })}
            placeholder="Email"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alt Email
          </label>
          <input
            {...register("altEmail")}
            placeholder="Alternative Email"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location/City
          </label>
          <input
            {...register("city")}
            placeholder="City"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tag*
          </label>
          <input
            {...register("tag")}
            placeholder="Tag"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>
      </div>
    </fieldset>
  );
}

export default PersonalDetails;
