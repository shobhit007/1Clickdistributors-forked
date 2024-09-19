"use client";

import React, { useState } from "react";

const AllocateLeadModal = ({ data, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const onFormSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onSubmit();
    }, 2000);
  };

  return (
    <div className="w-full h-full p-2 flex flex-col">
      <div className="h-[90%] flex flex-col">
        <h2 className="text-lg font-semibold text-slate-600">
          Allocate {data.length} leads
        </h2>

        <select className="py-2 w-full px-2 rounded mt-1 border border-slate-600 outline-blue-500">
          <option className="" value={""}>
            Select sales member
          </option>
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
