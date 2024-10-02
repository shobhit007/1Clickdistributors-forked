import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import MultiSelectDropdown from "../uiCompoents/MultiSelectDropDown";
import { dispositions, subDispositions } from "@/lib/data/commonData";
import { MultiSelect } from "react-multi-select-component";

const Filters = ({ setLeads, originalData, leads }) => {
  const [selectedDisposition, setSelectedDisposition] = useState([]);
  const [selectedSubDisposition, setSelectedSubDisposition] = useState([]);
  const [filters, setFilters] = useState({
    unAllocated: false,
    salesMembers: [],
  });
  const [list, setList] = useState({
    salesMembers: [],
  });

  useEffect(() => {
    if (!originalData) {
      return;
    }
    let salesMembers = {};
    originalData?.forEach((lead) => {
      if (lead?.salesExecutive && !salesMembers[lead?.salesExecutive]) {
        salesMembers[lead?.salesExecutive] = {
          label: lead.salesExecutiveName,
          value: lead.salesExecutive,
        };
      }
    });

    let salesList = Object.values(salesMembers || {});
    setList({
      salesMembers: salesList,
    });
  }, [originalData]);

  const subDispositionOptions = [
    ...new Set(Object.values(subDispositions).flat()),
  ].map((item) => ({ label: item, value: item }));

  const dispositionsArr = dispositions?.map((item) => ({
    label: item,
    value: item,
  }));

  const filterLeads = () => {
    if (!Array.isArray(originalData)) {
      return;
    }

    let filtered = [...originalData];
    if (selectedDisposition?.length > 0) {
      let disp = selectedDisposition?.map((item) => item.value);
      filtered = filtered.filter((item) => disp.includes(item.disposition));
    }
    if (selectedSubDisposition?.length > 0) {
      let subDisp = selectedSubDisposition?.map((item) => item.value);
      filtered = filtered.filter((item) =>
        subDisp.includes(item.subDisposition)
      );
    }

    if (filters?.salesMembers?.length > 0) {
      let salesMembers = filters?.salesMembers?.map((item) => item.value);
      filtered = filtered.filter((item) =>
        salesMembers.includes(item.salesExecutive)
      );
    }

    if (filters?.unAllocated) {
      filtered = filtered.filter(
        (item) => !item.salesExecutive || item.salesExecutive == ""
      );
    }
    setLeads(filtered);
  };

  useEffect(() => {
    filterLeads();
  }, [selectedDisposition, selectedSubDisposition, filters, originalData]);

  const resetFilters = () => {
    setSelectedDisposition([]);
    setSelectedSubDisposition([]);
    setFilters({ unAllocated: false, salesMembers: [] });
  };

  return (
    <div className="flex items-end gap-4 px-2 flex-wrap my-2 mt-1">
      <button
        onClick={resetFilters}
        className="flex items-center gap-1 hover:bg-colorPrimary/20 bg-colorPrimary/10 px-3 py-1 rounded-md border border-colorPrimary text-colorPrimary font-semibold"
      >
        Reset filters
        <MdClose className="text-colorPrimary text-lg" />
      </button>

      <div className="w-[180px] flex gap-[2px] flex-col">
        <span className="text-xs text-gray-400">Disposition</span>
        <MultiSelect
          options={dispositionsArr}
          value={selectedDisposition}
          onChange={setSelectedDisposition}
          labelledBy="Disposition"
        />
      </div>
      <div className="w-[180px] flex gap-[2px] flex-col">
        <span className="text-xs text-gray-400">Sub-disposition</span>
        <MultiSelect
          options={subDispositionOptions}
          value={selectedSubDisposition}
          onChange={setSelectedSubDisposition}
          labelledBy="Sub-Disposition"
        />
      </div>
      {list?.hasOwnProperty("salesMembers") && (
        <div className="w-[180px] flex gap-[2px] flex-col">
          <span className="text-xs text-gray-400">SalesMembers</span>
          <MultiSelect
            options={list?.salesMembers}
            value={filters?.salesMembers}
            onChange={(e) => setFilters((pre) => ({ ...pre, salesMembers: e }))}
            labelledBy="SalesMembers"
            className=""
          />
        </div>
      )}

      <button
        onClick={() =>
          setFilters((pre) => ({ ...pre, unAllocated: !pre.unAllocated }))
        }
        className={`py-1 px-3 border font-semibold rounded-md ${
          filters?.unAllocated
            ? "bg-colorPrimary  text-white"
            : "bg-white text-gray-500"
        }`}
      >
        Unallocated
      </button>
    </div>
  );
};

export default Filters;
