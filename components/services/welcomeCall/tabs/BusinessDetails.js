import React from "react";
import { CiImageOn } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

function BusinessDetails({
  register,
  serviceType,
  showModal,
  toggleBrandModal,
  remove,
  addBrands,
  fields,
}) {
  return (
    <fieldset className="bg-white p-4">
      <legend className="text-lg font-semibold">Business Details</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            {...register("companyName")}
            placeholder="Company Name"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Type
          </label>
          <select
            {...register("companyType")}
            className="select w-full border rounded border-gray-300 p-3"
          >
            <option value="Proprietorship">Proprietorship</option>
            <option value="Partnership">Partnership</option>
            <option value="Private Limited">Private Limited</option>
            <option value="Public Limited">Public Limited</option>
            <option value="LLP">LLP</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {serviceType === "distributor" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience *
            </label>
            <input
              {...register("experience")}
              placeholder="Experience (in years)"
              type="number"
              className="input w-full border rounded border-gray-300 p-3"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Turnover *
          </label>
          <div className="flex gap-2">
            <input
              {...register("turnover")}
              placeholder="Turnover"
              className="input w-full border rounded border-gray-300 p-3"
            />
            <select
              {...register("turnover_type")}
              className="select w-full border rounded border-gray-300 p-3"
            >
              <option value="lakh">Lakh</option>
              <option value="crore">Crore</option>
              <option value="million">Million</option>
              <option value="billion">Billion</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year of Establishment *
          </label>
          <input
            {...register("yearOfEstablishment")}
            placeholder="Year of Establishment"
            type="number"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Address
          </label>
          <input
            {...register("address")}
            placeholder="Full Address"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode *
          </label>
          <input
            {...register("pincode")}
            placeholder="Pincode"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            {...register("city")}
            placeholder="City"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            {...register("state")}
            placeholder="State"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div>

        {serviceType === "distributor" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investment Budget *
              </label>
              <input
                {...register("investmentBudget")}
                placeholder="Investment Budget"
                type="number"
                className="input w-full border rounded border-gray-300 p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visiting Card
              </label>
              <div
                className="w-full flex items-center gap-2 border rounded border-gray-300 p-3 hover:cursor-pointer"
                onClick={() => document.getElementById("visitingCard").click()}
              >
                <CiImageOn size={24} />
                <span className="block text-sm font-medium text-gray-700">
                  Select visiting card
                </span>
                <input
                  {...register("visitingCard")}
                  id="visitingCard"
                  type="file"
                  accept={"image/*"}
                  className="hidden"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brands Working With *
              </label>
              <button
                type="button"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center gap-2"
                onClick={toggleBrandModal}
              >
                <FiPlus size={24} className="text-white" />
                Add Brand
              </button>

              {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-96 overflow-hidden">
                    <div className="w-full flex items-center justify-between">
                      <h3 className="text-lg font-semibold mb-4">Add Brand</h3>
                      <IoClose
                        size={24}
                        color="black"
                        onClick={toggleBrandModal}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="w-full flex gap-2">
                      <input
                        placeholder="Brand Name"
                        {...register("brandName")}
                        type="text"
                        className="input w-full border rounded border-gray-300 p-2"
                      />
                      <button
                        type="button"
                        className="w-16 border rounded-sm border-gray-300 flex items-center justify-center"
                        onClick={addBrands}
                      >
                        <FiPlus size={24} className="text-black" />
                      </button>
                    </div>
                    <div className="w-full h-64 mt-2 p-2 overflow-x-hidden overflow-y-auto">
                      {fields.map((item, index) => (
                        <div
                          key={item.id} // Use `item.id` provided by `useFieldArray`
                          className="w-full flex items-center justify-between p-2 rounded border border-gray-300 mt-1 first:mt-0"
                        >
                          <span className="block text-sm text-gray-600 break-words max-w-[90%]">
                            {/* Ensure the text wraps properly and doesn't overflow */}
                            {item.name}
                          </span>
                          <button
                            onClick={() => remove(index)}
                            className="flex-shrink-0" // Ensure button doesn't shrink
                          >
                            <IoClose
                              size={18}
                              className="text-gray-400 hover:text-gray-600"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </fieldset>
  );
}

export default BusinessDetails;
