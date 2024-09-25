import { useState } from "react";

const ManualLeadForm = () => {
  // Initialize state for each form field
  const [formData, setFormData] = useState({
    date: "",
    lookingFor: "",
    companyName: "",
    contactPerson: "",
    mobile: "",
    altMobile: "",
    mailId: "",
    city: "",
    message: "",
    profileScore: "",
    allocatedTo: "",
    disposition: "",
    remarks: "",
  });

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

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result.message);

      // Optionally, display a success message to the user
      alert(result.message);

      // Reset form
      setFormData({
        date: "",
        lookingFor: "",
        companyName: "",
        contactPerson: "",
        mobile: "",
        altMobile: "",
        mailId: "",
        city: "",
        message: "",
        profileScore: "",
        allocatedTo: "",
        disposition: "",
        remarks: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Contact Form</h1>
      <form onSubmit={handleSubmit}>
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
            htmlFor="mobile"
            className="block text-gray-700 font-semibold mb-2"
          >
            Mobile:
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
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
            Alternate Mobile:
          </label>
          <input
            type="tel"
            id="altMobile"
            name="altMobile"
            value={formData.altMobile}
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
            Mail ID:
          </label>
          <input
            type="email"
            id="mailId"
            name="mailId"
            value={formData.mailId}
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
            htmlFor="message"
            className="block text-gray-700 font-semibold mb-2"
          >
            Message / Requirement:
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
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
            type="number"
            id="profileScore"
            name="profileScore"
            value={formData.profileScore}
            onChange={handleChange}
            min="0"
            max="100"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter profile score (0-100)"
          />
        </div>

        {/* Allocated To */}
        <div className="mb-4">
          <label
            htmlFor="allocatedTo"
            className="block text-gray-700 font-semibold mb-2"
          >
            Allocated To:
          </label>
          <input
            type="text"
            id="allocatedTo"
            name="allocatedTo"
            value={formData.allocatedTo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter name of the person allocated to"
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
            <option value="">-- Select Disposition --</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Follow Up">Follow Up</option>
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default ManualLeadForm;
