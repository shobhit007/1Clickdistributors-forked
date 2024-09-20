"use client";

import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import panelContext from "@/lib/context/panelContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify"; // Assuming you're using toast for error notifications
import PanelSelector from "@/components/homepage/PanelSelector";
import ManageRolesAndPermission from "@/components/homepage/ManageRolesAndPermission";
import ManageRoles from "@/components/homepage/ManageRoles";
import ManageUsers from "@/components/manageUsers";
import AllocateLeadsPanel from "@/components/allocateLead";
import Sales from "@/components/sales/Sales";

const Page = () => {
  const [displayComponent, setDisplayComponent] = useState("Manage roles");

  // get roles of the user
  const getRoles = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/roles/getRolePanels`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in getting roles", error.message);
      return null;
    }
  };

  // Fetch user roles using react-query
  const {
    data: userRoles,
    isLoading,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ["userRoles"],
    queryFn: getRoles,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userRoles?.panels?.length > 0) {
      setDisplayComponent(userRoles?.panels?.[0]);
    }
  }, [userRoles]);

  // if (isLoading) {
  //   return (
  //     <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
  //       <img src="/loader.gif" className="h-[60px] w-auto" alt="loading" />
  //       <p className="text-xl font-bold text-gray-500 mt-3">
  //         Loading... please wait
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <panelContext.Provider
      value={{ displayComponent, setDisplayComponent, userRoles }}
    >
      <div className="w-full h-[100vh] overflow-auto">
        <Header />
        <PanelSelector />

        {displayComponent == "roles_and_permissions" && <ManageRoles />}
        {displayComponent == "manage_users" && <ManageUsers />}
        {displayComponent == "allocate_leads" && <AllocateLeadsPanel />}
        {displayComponent == "sales_panel" && <Sales />}
      </div>
    </panelContext.Provider>
  );
};

export default Page;
