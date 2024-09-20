import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { dispositions, subDispositions } from "@/lib/data/commonData";
import { toast } from "react-toastify";

function UpdateLead({ onClose, leads }) {
  const [update, setUpdate] = useState({
    disposition: "Not Open",
    subDisposition: "",
    FollowUpDate: "",
  });

  useEffect(() => {
    setUpdate((prevState) => ({
      ...prevState,
      subDisposition: subDispositions[prevState.disposition][0] || "",
    }));
  }, [update.disposition]);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdate({ ...update, [name]: value });
  };

  const updateLeadStage = async () => {
    try {
      if (!update.FollowUpDate) {
        toast.error("Please select follow up date");
        return;
      }
      const body = {
        leads: leads.map((lead) => lead.leadId),
        followUpDate: update.FollowUpDate,
        disposition: update.disposition,
        subDisposition: update.subDisposition,
      };

      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/updateLead`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        onClose();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("error in updateLead", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="h-[70vh] w-[90vw] md:w-[25vw] bg-white rounded-md relative overflow-auto">
      <div className="w-full flex justify-end">
        <button className="p-2 bg-red-500" onClick={onClose}>
          <MdClose className="text-white text-3xl" />
        </button>
      </div>
      <div className="px-4 pt-8 pb-4 w-full">
        <select
          className={`border p-2 rounded-md border-gray-400 w-full`}
          name="disposition"
          value={update.disposition}
          onChange={handleUpdateChange}
        >
          {dispositions?.map((disposition, idx) => (
            <option key={idx.toString()} value={disposition}>
              {disposition}
            </option>
          ))}
        </select>

        <select
          className={`border p-2 rounded-md border-gray-400 w-full mt-4`}
          name="subDisposition"
          value={update.subDisposition}
          onChange={handleUpdateChange}
        >
          {subDispositions[update.disposition]?.map((subDisposition, idx) => (
            <option key={idx.toString()} value={subDisposition}>
              {subDisposition}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          className="mt-4 w-full border-1 p-2 rounded border-gray-400"
          onChange={handleUpdateChange}
          name="FollowUpDate"
        />

        <button
          className="mt-8 bg-colorPrimary text-white p-2 rounded-md w-full"
          onClick={updateLeadStage}
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default UpdateLead;
