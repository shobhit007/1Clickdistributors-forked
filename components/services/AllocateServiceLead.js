"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { MdArrowDropUp, MdArrowRight } from "react-icons/md";
import { toast } from "react-toastify";
import MultiLevelDropdown from "../allocateLead/multiLevelDropdown";

const AllocateServiceLead = ({ data, onSubmit, loading }) => {
  const [selectedServiceMember, setSelectedServiceMember] = useState(null);
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [allServiceMembers, setAllServiceMembers] = useState([]);
  const componentRef = useRef(null);

  const flattenTeamMembers = (data) => {
    let allMembers = [];

    const extractMembers = (members) => {
      members.forEach((member) => {
        allMembers.push(member);
        if (member.teamMembers && member.teamMembers.length > 0) {
          extractMembers(member.teamMembers); // Recursively extract from nested teamMembers
        }
      });
    };

    extractMembers(data);
    return allMembers;
  };

  const getallMembers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/getServiceMembers`;
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

  const { data: allMembers, refetch } = useQuery({
    queryKey: ["allServiceMembers"],
    queryFn: getallMembers,
  });

  useEffect(() => {
    if (!allMembers?.length) {
      return;
    }
    const data = flattenTeamMembers(allMembers);
    setAllServiceMembers(data);
  }, [allMembers]);

  const onFormSubmit = () => {
    if (!selectedServiceMember || selectedServiceMember == "") {
      return toast.error("Please select sales member");
    }
    onSubmit({
      id: selectedServiceMember.id,
    });
  };

  return (
    <div className="w-full flex flex-row items-end gap-5 mt-2 flex-wrap">
      <h2 className="text-lg font-semibold text-slate-600">
        Allocate {data.length} leads
      </h2>

      <div className="w-fit relative">
        <button
          id="dropdown-button"
          className="min-w-[200px] py-1 px-2 border border-gray-500 rounded-md text-start flex justify-between"
          onClick={() => setDropDownVisible(!dropDownVisible)}
        >
          {selectedServiceMember ? selectedServiceMember?.name : "Select"}

          {dropDownVisible ? (
            <MdArrowDropUp className="text-2xl" id="dropdown-icon" />
          ) : (
            <MdArrowRight className="text-2xl" id="dropdown-icon" />
          )}
        </button>

        {dropDownVisible && Array.isArray(allMembers) && (
          <div
            ref={componentRef}
            className="absolute bottom-10 left-0 bg-white shadow-md shadow-gray-400 min-w-[300px] max-w-[500px] p-2 rounded max-h-[55vh] z-30 overflow-auto"
          >
            <MultiLevelDropdown
              items={allMembers}
              onSelect={(e) => {
                setSelectedServiceMember(e);
                setDropDownVisible(false);
              }}
              allItems={allServiceMembers}
            />
          </div>
        )}
      </div>

      <button
        disabled={loading}
        className={`text-white px-3 bg-colorPrimary py-[2px] rounded-md disabled:bg-colorPrimary/40 ${
          loading ? "animate-pulse" : ""
        }`}
        onClick={onFormSubmit}
      >
        {loading ? "Allocating..." : "Allocate now"}
      </button>
      {/* <button
        className={`text-white px-3 bg-colorPrimary py-[2px] rounded-md disabled:bg-colorPrimary/40 ${
          loading ? "animate-pulse" : ""
        }`}
        onClick={refetch}
      >
        refetch
      </button> */}

      {/* <MultiLevelDropdown /> */}
    </div>
  );
};

export default AllocateServiceLead;
