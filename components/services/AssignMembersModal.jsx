import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import WelcomeCall from "./welcomeCall";

const AssignMembersModal = ({ isOpen, onClose, selectedRow, selectedTab }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [allMembers, setAllMembers] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("full_name");
  const [filteredAllMembers, setFilteredAllMembers] = useState([]);
  const [filteredAssignedMembers, setFilteredAssignedMembers] = useState([]);
  const [showMemberProfile, setShowMemberProfile] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch API data for distributors or manufacturers (All tab)
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

  const { data, refetch: refetchDistributorsOrManufacturers } = useQuery({
    queryKey: ["fetchDistributorsOrManufacturers", selectedTab, selectedRow],
    queryFn: fetchDistributorsOrManufacturers,
    enabled: selectedTab !== undefined,
  });

  useEffect(() => {
    if (data) {
      // const fetchedMembers = data.map((item) => ({
      //   full_name: item.full_name,
      //   id: item.profileId,
      //   tag: item.tag || "",
      //   leadId: item.leadId,
      //   category: item.category || "",
      //   subCategory: item.subCategory || "",
      // }));
      setAllMembers(data);
      setFilteredAllMembers(data);
    }
  }, [data]);

  // Fetch API data for assigned members
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
      return result.success ? result.data : [];
    } catch (error) {
      console.log("error in fetchAssignedMembers", error.message);
      return [];
    }
  };

  const { data: assignedData, refetch: refetchAssignedMembers } = useQuery({
    queryKey: ["fetchAssignedMembers", selectedTab, selectedRow],
    queryFn: fetchAssignedMembers,
  });

  useEffect(() => {
    if (assignedData) {
      const fetchedMembers = assignedData.map((item) => ({
        id: item.serviceId,
        ...item,
      }));
      setAssignedMembers(fetchedMembers);
      setFilteredAssignedMembers(fetchedMembers);
    }
  }, [assignedData]);

  // Client-side filtering for both tabs as user types
  useEffect(() => {
    const filterMembers = (members) => {
      if (!searchQuery) return members;
      return members.filter((member) =>
        member[searchField]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    };
    setFilteredAllMembers(filterMembers(allMembers));
    setFilteredAssignedMembers(filterMembers(assignedMembers));
  }, [searchQuery, searchField, allMembers, assignedMembers]);

  // Search API call for "All" tab only
  const searchAllMembers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/searchDistributorsOrManufacturers`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchField,
          searchQuery,
        }),
      });
      const result = await response.json();
      if (result.success) {
        const searchedMembers = result.data.map((item) => ({
          full_name: item.full_name,
          id: item.profileId,
          tag: item.tag || "",
          leadId: item.leadId,
          category: item.category || "",
          subCategory: item.subCategory || "",
        }));
        // setAllMembers(searchedMembers);
        setFilteredAllMembers(searchedMembers);
      } else {
        toast.error("Search failed");
      }
    } catch (error) {
      console.log("error in searchAllMembers", error.message);
      toast.error("Error during search");
    }
  };

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

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (activeTab === "all") {
        searchAllMembers(); // API search for "All" tab
      }
      // For "Assigned" tab, filtering is already handled by useEffect
    } else {
      // Reset to original data if search is cleared
      refetchDistributorsOrManufacturers();
      refetchAssignedMembers();
    }
  };

  const toggleMemberProfile = (member) => {
    setSelectedMember(member);
    setShowMemberProfile(!showMemberProfile);
  };

  if (!isOpen || !selectedRow) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 flex flex-col h-[500px]">
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

        {/* Search Bar */}
        <div className="mb-4 flex-none">
          <div className="flex items-center space-x-2">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="full_name">Name</option>
              <option value="tag">Tag</option>
              <option value="category">Category</option>
              <option value="subCategory">Subcategory</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search by ${
                searchField === "full_name" ? "name" : searchField
              }`}
              className="border border-gray-300 rounded px-2 py-1 flex-1"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </div>

        {/* Tab Content with Scroll */}
        <div className="flex-1 overflow-y-auto pr-4">
          {activeTab === "all" && (
            <ul className="space-y-2">
              {filteredAllMembers.map((member) => (
                <li
                  key={member.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <button onClick={() => toggleMemberProfile(member)}>
                      <span className="font-bold">{member.full_name}</span>
                    </button>
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
              {filteredAssignedMembers.map((member) => (
                <li
                  key={member.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <button onClick={() => toggleMemberProfile(member)}>
                      <span className="font-bold">{member.full_name}</span>
                    </button>
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

      {showMemberProfile && selectedMember && (
        <WelcomeCall
          closeModal={() => setShowMemberProfile(false)}
          selectedRow={selectedMember}
          serviceType={selectedTab}
          refetchServiceLeads={refetchAssignedMembers}
        />
      )}
    </div>
  );
};

export default AssignMembersModal;
