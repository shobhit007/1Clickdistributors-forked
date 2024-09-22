"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { MdArrowDropUp, MdArrowRight } from "react-icons/md";
import { toast } from "react-toastify";

const AllocateLeadModal = ({ data, onSubmit, loading }) => {
  const [gettingSalesMembers, setGettingSalesMembers] = useState(false);
  const [selectedSalesMember, setSelectedSalesMember] = useState(null);
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [subLevelToShow, setSubLevelToShow] = useState(null);

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

  const managers = [
    {
      id: "1",
      name: "Level 1",
      data: ["sublevel_1-1", "sublevel_1-2", "sublevel_1-3"],
    },
    { id: "2", name: "Level 2", data: ["sublevel_2-1", "sublevel_2-2"] },
    { id: "3", name: "Level 1", data: [] },
  ];

  const onSelectMember = (item) => {
    setSelectedSalesMember(item);
    setDropDownVisible(false);
    setSubLevelToShow(null);
  };

  // useEffect(() => {
  //   const onClickOutside = (e) => {
  //     if (
  //       e.target.id != "dropdown-button" &&
  //       e.target.id != "dropdown" &&
  //       e.target.id != "dropdown-icon"
  //     ) {
  //       setDropDownVisible(false);
  //     }
  //   };
  //   window.addEventListener("click", onClickOutside);

  //   return () => window.removeEventListener("click", onClickOutside);
  // }, [dropDownVisible]);

  // console.log("visibleDropDownVisible", dropDownVisible);

  return (
    <div className="w-full flex flex-row items-end gap-5 mt-2">
      <h2 className="text-lg font-semibold text-slate-600">
        Allocate {data.length} leads
      </h2>

      {/* <select
        onChange={(e) => setSelectedSalesMember(e.target.value)}
        className="py-1  px-2 rounded mt-1 border border-slate-600 outline-blue-500"
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
      </select> */}

      <div className="w-fit relative">
        <button
          id="dropdown-button"
          className="w-48 py-1 px-2 border border-gray-500 rounded-md text-start flex justify-between"
          onClick={() => setDropDownVisible(!dropDownVisible)}
        >
          {selectedSalesMember ? selectedSalesMember : "Select"}

          {dropDownVisible ? (
            <MdArrowDropUp className="text-2xl" id="dropdown-icon" />
          ) : (
            <MdArrowRight className="text-2xl" id="dropdown-icon" />
          )}
        </button>
        {dropDownVisible && (
          <div
            id="dropdown"
            className="absolute bottom-10 left-0 bg-gray-100 shadow-md shadow-gray-400 w-full p-2 rounded min-w-56 max-h-[55vh] z-30 overflow-auto"
          >
            {managers?.map((manager) => {
              return (
                <div className="border-b flex flex-col gap-1 border-b-gray-500 text-gray-600 py-1 cursor-pointer relative">
                  <div className="flex justify-between w-full">
                    <span>{manager.name}</span>

                    {subLevelToShow == manager.id ? (
                      <MdArrowDropUp
                        className="text-2xl"
                        onClick={() => setSubLevelToShow(null)}
                      />
                    ) : (
                      <MdArrowRight
                        className="text-2xl"
                        onClick={() => setSubLevelToShow(manager?.id)}
                      />
                    )}
                  </div>

                  {subLevelToShow == manager.id && (
                    <div className="rounded-md w-full mt-1 px-2 transition-all flex flex-col gap-2">
                      {manager?.data?.map((item) => {
                        return (
                          <div
                            onClick={() => onSelectMember(item)}
                            className="flex justify-between w-full p-1 rounded bg-gray-200 hover:bg-gray-300"
                          >
                            <span>{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
    </div>
  );
};

export default AllocateLeadModal;
