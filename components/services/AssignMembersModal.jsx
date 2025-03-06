import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AssignMembersModal = ({ isOpen, onClose, selectedRow, selectedTab }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [allMembers, setAllMembers] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);

  // Fetch API data for distributors or manufacturers
  const fetchDistributorsOrManufacturers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/getDistributorsOrManufacturers`;
      const type =
        selectedTab === "manufaturers" ? "manufacturer" : "distributor";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, leadId: selectedRow.leadId }),
      });
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.log("error in fetchDistributorsOrManufacturers", error.message);
      return [];
    }
  };

  // React Query call
  const { data, refetch: refetchDistributorsOrManufacturers } = useQuery({
    queryKey: ["fetchDistributorsOrManufacturers", selectedTab, selectedRow],
    queryFn: fetchDistributorsOrManufacturers,
    enabled: selectedTab !== undefined,
  });

  // Only update allMembers when the raw data changes
  useEffect(() => {
    if (data) {
      const fetchedMembers = data.map((item) => ({
        name: item.full_name,
        id: item.profileId,
        tag: item.tag || "",
        leadId: item.leadId,
      }));
      setAllMembers(fetchedMembers);
    }
  }, [data]);

  const fetchAssignedMembers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const type =
        selectedTab === "manufaturers" ? "manufacturer" : "distributor";
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/getAssignedDistributorsOrManufacturers`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, leadId: selectedRow.leadId }),
      });
      const result = await response.json();
      console.log("result", result);
      return result.success ? result.data : [];
    } catch (error) {
      console.log("error in fetchDistributorsOrManufacturers", error.message);
      return [];
    }
  };

  // React Query call
  const { data: assignedData, refetch: refetchAssignedMembers } = useQuery({
    queryKey: ["fetchAssignedMembers", selectedTab, selectedRow],
    queryFn: fetchAssignedMembers,
  });

  useEffect(() => {
    if (assignedData) {
      const fetchedMembers = assignedData.map((item) => ({
        name: item.full_name,
        id: item.serviceId,
        tag: item.tag || "",
        leadId: item.leadId,
      }));
      setAssignedMembers(fetchedMembers);
    }
  }, [assignedData]);

  // Handlers for assignment
  const handleAssign = async (member) => {
    try {
      const body = { type: selectedTab };

      body.manufacturerId =
        selectedTab === "manufaturers" ? selectedRow.leadId : member.leadId;
      body.distributorId =
        selectedTab === "distributors" ? selectedRow.leadId : member.leadId;

      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/assignDistributorOrManufacturer`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        refetchDistributorsOrManufacturers();
        refetchAssignedMembers();
        toast.success(result.message);
      } else {
        toast.error("Failed to assign member");
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
    }
  };

  const handleUnassign = async (member) => {
    try {
      console.log("member", member);
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/removeDistributorOrManufacturer`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviceId: member.id, memberId: member.leadId }),
      });

      if (response.ok) {
        const result = await response.json();
        refetchDistributorsOrManufacturers();
        refetchAssignedMembers();
        toast.success(result.message);
      } else {
        toast.error("Failed to unassign member");
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
    }
  };

  // Only render the modal if isOpen and selectedRow are valid
  if (!isOpen || !selectedRow) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 flex flex-col min-h-96 max-h-[80vh]">
        {/* Modal Header with Close Button */}
        <div className="relative mb-4 flex-none">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 flex-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 ${
              activeTab === "all" ? "bg-gray-200" : "bg-gray-100"
            } rounded-tl-lg rounded-tr-lg`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("assigned")}
            className={`px-4 py-2 ${
              activeTab === "assigned" ? "bg-gray-200" : "bg-gray-100"
            } rounded-tl-lg rounded-tr-lg ml-2`}
          >
            Assigned
          </button>
        </div>

        {/* Tab Content with Scroll */}
        <div className="flex-1 overflow-y-auto pr-4">
          {activeTab === "all" && (
            <ul className="space-y-2">
              {allMembers.map((member) => (
                <li
                  key={member.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold">{member.name}</span>
                    <span className="block text-gray-600">{member.tag}</span>
                  </div>
                  <button
                    onClick={() => handleAssign(member)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Assign
                  </button>
                </li>
              ))}
            </ul>
          )}
          {activeTab === "assigned" && (
            <ul className="space-y-2">
              {assignedMembers.map((member) => (
                <li
                  key={member.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold">{member.name}</span>
                    <span className="block text-gray-600">{member.tag}</span>
                  </div>
                  <button
                    onClick={() => handleUnassign(member)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Unassign
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignMembersModal;
