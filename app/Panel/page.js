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
import { panelPermissions } from "@/lib/data/commonData";

const Page = () => {
  const [displayComponent, setDisplayComponent] = useState("Manage roles");
  const [userRoles, setuserRoles] = useState(null);

  // get roles of the user
  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/getUserDetails`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
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
    data: userDetails,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["userRoles"],
    queryFn: getUserDetails,
  });

  useEffect(() => {
    if (userDetails?.permissionsType == "all_permissions") {
      let panels = panelPermissions.map((item) => item.panelName);
      setuserRoles(panels);
      return;
    }

    if (userDetails?.userPermissions) {
      let panels = Object.keys(userDetails.userPermissions || {});
      let roles = [];
      for (let panel of panels) {
        if (userDetails.userPermissions[panel]?.length > 0) {
          roles.push(panel);
        }
      }
      setuserRoles(roles);
    }
  }, [userDetails]);

  useEffect(() => {
    if (userRoles?.length > 0) {
      let previousComponent = localStorage.getItem("currentDisplayComponent");
      if (previousComponent && userRoles.includes(previousComponent)) {
        setDisplayComponent(previousComponent);
      } else {
        setDisplayComponent(userRoles[0]);
      }
    }
  }, [userRoles]);

  return (
    <panelContext.Provider
      value={{ displayComponent, setDisplayComponent, userRoles, userDetails }}
    >
      <div className="w-full h-[100vh] overflow-auto">
        <Header />
        <PanelSelector />
        {/* <button onClick={refetchUser}>refetch</button> */}

        {displayComponent == "roles_and_permissions" && <ManageRoles />}
        {displayComponent == "manage_users" && <ManageUsers />}
        {displayComponent == "allocate_leads" && <AllocateLeadsPanel />}
        {displayComponent == "sales_panel" && <Sales />}
      </div>
    </panelContext.Provider>
  );
};

export default Page;
