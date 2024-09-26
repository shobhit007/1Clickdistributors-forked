import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { dispositions, subDispositions } from "@/lib/data/commonData";
import { toast } from "react-toastify";

const ManualLeadForm = ({ onClose }) => {
  // Initialize state for each form field
  const [formData, setFormData] = useState({
    date: "",
    lookingFor: "",
    companyName: "",
    contactPerson: "",
    phone: "",
    altPhone: "",
    email: "",
    city: "",
    requirement: "",
    profileScore: "",
    salesMember: "",
    disposition: dispositions[0],
    subDisposition: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);

  const getSalesMembers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/getSalesMembers`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.salesMembers;
    } catch (error) {
      console.log("error in getting leads", error.message);
      return null;
    }
  };

  const { data: salesMembers } = useQuery({
    queryKey: ["salesMembers"],
    queryFn: getSalesMembers,
  });

  // Set default salesMember once salesMembers are fetched
  useEffect(() => {
    if (salesMembers?.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        salesMember: salesMembers[0].salesMemberId,
      }));
    }
  }, [salesMembers]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/createdManualLead`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
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
        <form onSubmit={handleSubmit} className="px-4">
          {/* Date */}
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-gray-700 font-semibold mb-2"
            >
              Date:
            </label>
            <input
              type="date"
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
              Phone:
            </label>
            <input
              type="tel"
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
              htmlFor="altMobile"
              className="block text-gray-700 font-semibold mb-2"
            >
              Alternate Phone:
            </label>
            <input
              type="tel"
              id="altPhone"
              name="altPhone"
              value={formData.altPhone}
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
              Profile Score:
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
          <div className="mb-4">
            <label
              htmlFor="salesMember"
              className="block text-gray-700 font-semibold mb-2"
            >
              Allocated To:
            </label>
            <select
              id="salesMember"
              name="salesMember"
              value={formData.salesMember}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white"
            >
              {salesMembers?.map((sm, i) => (
                <option key={sm.salesMemberId} value={sm.salesMemberId}>
                  {sm.name}
                </option>
              ))}
            </select>
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
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualLeadForm;
