"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { MdArrowDropUp, MdArrowRight } from "react-icons/md";
import { toast } from "react-toastify";
import MultiLevelDropdown from "./multiLevelDropdown";

const AllocateLeadModal = ({ data, onSubmit, loading }) => {
  const [gettingSalesMembers, setGettingSalesMembers] = useState(false);
  const [selectedSalesMember, setSelectedSalesMember] = useState(null);
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [subLevelToShow, setSubLevelToShow] = useState(null);
  const [allSalesMembers, setAllSalesMembers] = useState([]);

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
      setGettingSalesMembers(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getSalesTeamMembers`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGettingSalesMembers(false);
      if (data.success && data.data) {
        return data.data;
      } else {
        toast.error(data.message || "couldn't find leaders");
        return null;
      }
    } catch (error) {
      setGettingSalesMembers(false);
      console.log("error in getting salesMembers", error.message);
      toast.error(error.message);
      return null;
    }
  };

  const { data: allMembers, refetch } = useQuery({
    queryKey: ["allSalesMembers"],
    queryFn: getallMembers,
  });

  useEffect(() => {
    if (!allMembers?.length) {
      return;
    }
    const data = flattenTeamMembers(allMembers);
    setAllSalesMembers(data);
  }, [allMembers]);

  const onFormSubmit = () => {
    if (!selectedSalesMember || selectedSalesMember == "") {
      return toast.error("Please select sales member");
    }
    onSubmit({ id: selectedSalesMember.id });
  };

  const onSelectMember = (item) => {
    setSelectedSalesMember(item);
    setDropDownVisible(false);
    setSubLevelToShow(null);
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
          {selectedSalesMember ? selectedSalesMember?.name : "Select"}

          {dropDownVisible ? (
            <MdArrowDropUp className="text-2xl" id="dropdown-icon" />
          ) : (
            <MdArrowRight className="text-2xl" id="dropdown-icon" />
          )}
        </button>
        {/* {dropDownVisible && (
          <div
            id="dropdown"
            className="absolute bottom-10 left-0 bg-gray-100 shadow-md shadow-gray-400 w-full p-2 rounded min-w-56 max-h-[55vh] z-30 overflow-auto"
          >
            {Array.isArray(allMembers) &&
              allMembers?.map((leader) => {
                return (
                  <div className="border-b flex flex-col gap-1 border-b-gray-500 text-gray-600 py-1 cursor-pointer relative">
                    <div className="flex justify-between w-full">
                      <div className="flex flex-col">
                        <span>{leader.name}</span>
                        <span className="text-xs text-gray-400">
                          {leader.role}
                        </span>
                      </div>

                      {subLevelToShow == leader.id ? (
                        <MdArrowDropUp
                          className="text-2xl"
                          onClick={() => setSubLevelToShow(null)}
                        />
                      ) : (
                        <MdArrowRight
                          className="text-2xl"
                          onClick={() => setSubLevelToShow(leader?.id)}
                        />
                      )}
                    </div>

                    {subLevelToShow == leader.id && (
                      <div className="rounded-md w-full mt-1 px-2 transition-all flex flex-col gap-2">
                        {leader?.teamMembers?.map((item) => {
                          return (
                            <div
                              onClick={() => onSelectMember(item)}
                              className="flex justify-between w-full p-1 rounded bg-gray-200 hover:bg-gray-300"
                            >
                              <span>{item?.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )} */}

        {dropDownVisible && Array.isArray(allMembers) && (
          <div className="absolute bottom-10 left-0 bg-white shadow-md shadow-gray-400 min-w-[300px] max-w-[500px] p-2 rounded max-h-[55vh] z-30 overflow-auto">
            <MultiLevelDropdown
              items={allMembers}
              onSelect={(e) => {
                setSelectedSalesMember(e);
                setDropDownVisible(false);
              }}
              allItems={allSalesMembers}
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
      <button
        className={`text-white px-3 bg-colorPrimary py-[2px] rounded-md disabled:bg-colorPrimary/40 ${
          loading ? "animate-pulse" : ""
        }`}
        onClick={refetch}
      >
        refetch
      </button>

      {/* <MultiLevelDropdown /> */}
    </div>
  );
};

export default AllocateLeadModal;
