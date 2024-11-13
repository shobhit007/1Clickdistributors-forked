import { useEffect, useState, useRef } from "react";
import { MdClose, MdOutlineChevronRight } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { dispositions, subDispositions } from "@/lib/data/commonData";
import { toast } from "react-toastify";
import MultiLevelDropdown from "../allocateLead/multiLevelDropdown";
import moment from "moment";

const ManualLeadForm = ({ onClose }) => {
  // Initialize state for each form field
  const [formData, setFormData] = useState({
    date: "",
    lookingFor: "",
    companyName: "",
    contactPerson: "",
    phone: "",
    mobileNumber: "",
    email: "",
    city: "",
    requirement: "",
    profileScore: "",
    disposition: dispositions[0],
    subDisposition: "",
    remarks: "",
    followUpDate: "",
  });
  const [selectedSalesMember, setSelectedSalesMember] = useState(null);
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const getAllTeamLeaders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getSalesTeamMembers`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      } else {
        toast.error(data.message || "couldn't find leaders");
        return null;
      }
    } catch (error) {
      console.log("error in getting salesMembers", error.message);
      toast.error(error.message);
      return null;
    }
  };

  const { data: allTeamLeaders, refetch } = useQuery({
    queryKey: ["allTeamMembers"],
    queryFn: getAllTeamLeaders,
  });

  useEffect(() => {
    setFormData((pre) => ({
      ...pre,
      subDisposition: subDispositions[formData.disposition][0],
    }));
  }, [formData.disposition]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    // Check if all required fields are filled
    if (
      !formData.date ||
      !formData.contactPerson ||
      !formData.email ||
      !formData.phone ||
      !formData.city ||
      !formData.requirement ||
      !formData.disposition ||
      !formData.subDisposition ||
      !selectedSalesMember ||
      !formData.followUpDate
    ) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Validate phone number (assuming 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    // Add selectedSalesMember to formData
    const updatedFormData = {
      ...formData,
      salesMember: selectedSalesMember,
      phone: `+91${formData.phone}`,
    };

    // If all validations pass, proceed with form submission
    try {
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/createdManualLead`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(updatedFormData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Lead created successfully");
        onClose();
      } else {
        toast.error(result.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const toggleDropDown = () => setDropDownVisible((p) => !p);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <div className="flex justify-end">
        <MdClose
          className="text-gray-700 cursor-pointer text-2xl mr-4"
          onClick={onClose}
        />
      </div>
      <div className="h-[80vh] overflow-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Manual Lead
        </h1>
        <div className="px-4">
          {/* Date */}
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-gray-700 font-semibold mb-2"
            >
              Date:
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {/* Looking For */}
          <div className="mb-4">
            <label
              htmlFor="lookingFor"
              className="block text-gray-700 font-semibold mb-2"
            >
              Looking For:
            </label>
            <input
              type="text"
              id="lookingFor"
              name="lookingFor"
              value={formData.lookingFor}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="What are you looking for?"
            />
          </div>

          {/* Company Name */}
          <div className="mb-4">
            <label
              htmlFor="companyName"
              className="block text-gray-700 font-semibold mb-2"
            >
              Company Name:
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your company name"
            />
          </div>

          {/* Contact Person */}
          <div className="mb-4">
            <label
              htmlFor="contactPerson"
              className="block text-gray-700 font-semibold mb-2"
            >
              Contact Person:
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter contact person's name"
            />
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-gray-700 font-semibold mb-2"
            >
              Default phone:
            </label>
            <input
              type="number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              placeholder="Enter 10-digit mobile number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {/* Alt Mobile */}
          <div className="mb-4">
            <label
              htmlFor="mobileNumber"
              className="block text-gray-700 font-semibold mb-2"
            >
              {"Mobile Number (Optional):"}
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              pattern="[0-9]{10}"
              placeholder="Enter 10-digit alternative mobile number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {/* Mail ID */}
          <div className="mb-4">
            <label
              htmlFor="mailId"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email ID:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your email address"
            />
          </div>

          {/* City */}
          <div className="mb-4">
            <label
              htmlFor="city"
              className="block text-gray-700 font-semibold mb-2"
            >
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your city"
            />
          </div>

          {/* Message / Requirement */}
          <div className="mb-4">
            <label
              htmlFor="requirement"
              className="block text-gray-700 font-semibold mb-2"
            >
              Message / Requirement:
            </label>
            <textarea
              id="requirement"
              name="requirement"
              value={formData.requirement}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Describe your requirements"
            ></textarea>
          </div>

          {/* Profile Score */}
          <div className="mb-4">
            <label
              htmlFor="profileScore"
              className="block text-gray-700 font-semibold mb-2"
            >
              {"Profile Score (Optional):"}
            </label>
            <input
              type="text"
              id="profileScore"
              name="profileScore"
              value={formData.profileScore}
              onChange={handleChange}
              min="0"
              max="100"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter profile score"
            />
          </div>

          {/* Allocated To */}
          <div className="mb-4 flex gap-4 relative">
            <div className="flex-1 text-left">
              <label
                htmlFor="salesMember"
                className="block text-gray-700 font-semibold mb-2"
              >
                Allocated To:
              </label>
            </div>
            <div className="flex-1 relative">
              <button
                className="w-full p-2 bg-gray-100 rounded"
                onClick={toggleDropDown}
              >
                {selectedSalesMember ? selectedSalesMember?.name : "Select"}
              </button>
              {dropDownVisible && (
                <div className="absolute right-0 bottom-full border left-0 mb-1">
                  <MultiLevelDropdown
                    items={allTeamLeaders}
                    onSelect={(e) => {
                      setSelectedSalesMember(e);
                      setDropDownVisible(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="followUpDate"
              className="block text-gray-700 font-semibold mb-2"
            >
              Next Call Back Date:
            </label>
            <input
              type="datetime-local"
              id="followUpDate"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {/* Disposition */}
          <div className="mb-4">
            <label
              htmlFor="disposition"
              className="block text-gray-700 font-semibold mb-2"
            >
              Disposition:
            </label>
            <select
              id="disposition"
              name="disposition"
              value={formData.disposition}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white"
            >
              {dispositions.map((disposition) => (
                <option key={disposition} value={disposition}>
                  {disposition}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Disposition */}
          <div className="mb-4">
            <label
              htmlFor="disposition"
              className="block text-gray-700 font-semibold mb-2"
            >
              Sub-Disposition:
            </label>
            <select
              id="subDisposition"
              name="subDisposition"
              value={formData.subDisposition}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white"
            >
              {subDispositions[formData.disposition].map((disposition) => (
                <option key={disposition} value={disposition}>
                  {disposition}
                </option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div className="mb-6">
            <label
              htmlFor="remarks"
              className="block text-gray-700 font-semibold mb-2"
            >
              Remarks:
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Any additional remarks"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualLeadForm;
