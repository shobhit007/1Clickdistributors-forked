import ManageUsers from "@/components/manageUsers";
import React from "react";

const page = () => {
  return (
    <div>
      <h1 className="text-5xl mt-10 text-center text-slate-500">
        1click distributors panel
        <ManageUsers />
      </h1>
    </div>
  );
};

export default page;
