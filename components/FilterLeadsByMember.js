import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

const FilterLeadsByMember = ({
  selectedSalesMembers,
  setSelectedSalesMembers,
}) => {
  const [gettingSalesMembers, setGettingSalesMembers] = useState(false);

  const getallMembers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      setGettingSalesMembers(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/panel/getAllInternalMembers`;
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
        let formatted = data?.data?.map((item) => {
          return {
            label: `${item.name}`,
            value: item.id,
          };
        });
        return formatted;
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

  return (
    <div className="w-[160px]">
      {Array.isArray(allMembers) && (
        <MultiSelect
          options={allMembers}
          value={selectedSalesMembers}
          onChange={(e) => setSelectedSalesMembers(e)}
          labelledBy="SalesMembers"
          className=""
        />
      )}
    </div>
  );
};

export default FilterLeadsByMember;
