import React from "react";
import { MdClose } from "react-icons/md";

const Filters = ({ setLeads, originalData }) => {
  return (
    <div className="flex items-center gap-4 px-2 flex-wrap my-2 mt-1">
      <button className="flex items-center gap-1 hover:bg-colorPrimary/20 bg-colorPrimary/10 px-3 py-1 rounded-md border border-colorPrimary text-colorPrimary font-semibold">
        Reset filters
        <MdClose className="text-colorPrimary text-lg" />
      </button>
    </div>
  );
};

export default Filters;
