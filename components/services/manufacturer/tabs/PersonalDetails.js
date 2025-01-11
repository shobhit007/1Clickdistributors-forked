import React from "react";

function PersonalDetails({ register, errors }) {
  return (
    <fieldset className="border p-4">
      <legend className="text-lg font-semibold">Personal Details</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            {...register("firstName", { required: true })}
            placeholder="First Name"
            className="input w-full border rounded border-gray-300 p-3"
          />
          {errors.firstName && (
            <p className="text-red-500">First Name is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            {...register("lastName", { required: true })}
            placeholder="Last Name"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation/Job Title
          </label>
          <input
            {...register("jobTitle")}
            placeholder="Designation/Job Title"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            {...register("mobile")}
            placeholder="Mobile Number"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
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
            {...register("location")}
            placeholder="Location/City"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>
      </div>
    </fieldset>
  );
}

export default PersonalDetails;
