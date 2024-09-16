import { useQuery } from "@tanstack/react-query";
import React from "react";

const ManageRolesAndPermission = () => {
  const getAllUserRoles = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/roles/getRoles`;
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

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllUserRoles,
    retry: false,
    refetchOnWindowFocus: false,
  });

  console.log("roles", roles);

  return <div>ManageRolesAndPermission</div>;
};

export default ManageRolesAndPermission;
