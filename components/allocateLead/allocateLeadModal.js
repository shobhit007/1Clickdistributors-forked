"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AllocateLeadModal = ({ data, onSubmit, loading }) => {
  const [gettingSalesMembers, setGettingSalesMembers] = useState(false);
  const [selectedSalesMember, setSelectedSalesMember] = useState(null);

  const getAllSalesMembers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      setGettingSalesMembers(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/getSalesMembers`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGettingSalesMembers(false);
      if (data.success && data?.salesMembers) {
        return data.salesMembers;
      } else {
        toast.error(data.message || "couldn't find sales members");
        return null;
      }
    } catch (error) {
      setGettingSalesMembers(false);
      console.log("error in getting salesMembers", error.message);
      toast.error(error.message);
      return null;
    }
  };

  const { data: salesMembers, refetch } = useQuery({
    queryKey: ["allSalesMembers"],
    queryFn: getAllSalesMembers,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const onFormSubmit = () => {
    if (!selectedSalesMember || selectedSalesMember == "") {
      return toast.error("Please select sales member");
    }
    onSubmit(selectedSalesMember);
  };

  return (
    <div className="w-full h-full p-2 flex flex-col">
      <div className="h-[90%] flex flex-col">
        <h2 className="text-lg font-semibold text-slate-600">
          Allocate {data.length} leads
        </h2>

        <select
          onChange={(e) => setSelectedSalesMember(e.target.value)}
          className="py-2 w-full px-2 rounded mt-1 border border-slate-600 outline-blue-500"
        >
          <option className="" value={""}>
            {gettingSalesMembers ? "Loading..." : "Select sales member"}
          </option>

          {Array.isArray(salesMembers) &&
            salesMembers?.length > 0 &&
            salesMembers?.map((member) => (
              <option
                selected={selectedSalesMember == member.email}
                className=""
                value={member.email}
              >
                {member.name}
              </option>
            ))}
        </select>
      </div>

      <button
        disabled={loading}
        className={`text-white w-full bg-colorPrimary py-1 rounded-md disabled:bg-colorPrimary/40 ${
          loading ? "animate-pulse" : ""
        }`}
        onClick={onFormSubmit}
      >
        {loading ? "Allocating..." : "Allocate now"}
      </button>
    </div>
  );
};

export default AllocateLeadModal;
