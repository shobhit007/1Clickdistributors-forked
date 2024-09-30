"use client";

import React, { useEffect, useState } from "react";
import { panelRoles, roles } from "@/lib/data/commonData";
import { toast } from "react-toastify";

const EdituserForm = ({ close, refetchUsers, currentUser, allUsers }) => {
  const [data, setData] = useState({
    name: "",
    password: "",
    phone: "",
    department: "",
    hierarchy: "",
  });
  const [loading, setLoading] = useState(false);
  const [allManagers, setAllManagers] = useState(null);
  useEffect(() => {
    if (currentUser) {
      setData({
        name: currentUser.name,
        password: currentUser.password,
        phone: currentUser.phone,
        role: currentUser.role,
        department: currentUser.department,
        hierarchy: currentUser.hierarchy,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    let managers = allUsers.filter((item) => item?.role?.includes("Manager"));
    setAllManagers(managers);
  }, [allUsers]);

  const handleInputChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    if (name == "manager") {
      console.log("for manager value is", value);
    }
    setData((pre) => ({ ...pre, [name]: value }));
  };

  let spanStyle =
    "text-slate-600 font-semibold text-base flex items-center gap-1";

  const handleUpdateUser = async () => {
    if (!data?.name || data.name == "" || data.name.length < 3) {
      return toast.error("Please enter a valid name");
    }
    if (!data?.password || data.password == "" || data.password.length < 4) {
      return toast.error("Enter mimimum 4 words in password");
    }

    if (!data?.phone || data.phone == "" || data.phone.length < 5) {
      return toast.error("Enter valid phone number");
    }

    if (!data?.role || data.role == "") {
      return toast.error("Please choose user role");
    }

    try {
      setLoading(true);
      let body = { ...data };

      if (!body?.role?.includes("Member")) {
        delete body.manager;
      } else if (body.manager && body.manager != "") {
        let selectedManger = allUsers.filter(
          (item) => item.id == body.manager
        )[0];
        body.managerName = selectedManger.name;
      }

      let token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/updateUser`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ ...body, email: currentUser.email }),
      });

      const response = await res.json();
      setLoading(false);
      if (response.success) {
        toast.success(response.message);
        refetchUsers();
        close();
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full p-2 flex flex-col gap-2">
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Enter name
        </span>
        <input
          type="text"
          name="name"
          required={true}
          className="w-full rounded-md border border-gray-300 p-1"
          value={data?.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Enter user phone number
        </span>
        <input
          type="number"
          name="phone"
          required={true}
          className="w-full rounded-md border border-gray-300 p-1"
          value={data?.phone}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Enter password for user
        </span>
        <input
          type="text"
          name="password"
          required={true}
          className="w-full rounded-md border border-gray-300 p-1"
          value={data?.password}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Select department of user
        </span>
        <select
          className={`border p-1 rounded-md border-gray-400`}
          name="department"
          value={data.department}
          onChange={(e) => {
            handleInputChange(e), setData((pre) => ({ ...pre, hierarchy: "" }));
          }}
        >
          <option>Select department</option>
          {panelRoles?.map((role) => (
            <option
              value={role.department}
              selected={data?.department == role.department}
            >
              {role?.department}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Select Hierarchy
        </span>
        <select
          className={`border p-1 rounded-md border-gray-400`}
          name="hierarchy"
          value={data.hierarchy}
          onChange={handleInputChange}
        >
          <option>Select Hierarchy</option>
          {panelRoles
            .filter((item) => item.department == data.department)?.[0]
            ?.hierarchy.map((item) => (
              <option value={item} selected={data?.hierarchy == item}>
                {item}
              </option>
            ))}
        </select>
      </div>

      {data.hierarchy == "member" && (
        <div className="flex flex-col w-full gap-1">
          <span className={`${spanStyle}`}>Select team leader</span>
          <select
            className={`border p-1 rounded-md border-gray-400`}
            name="leader"
            value={data.leader}
            onChange={handleInputChange}
          >
            <option>Select Hierarchy</option>
            {
              allLeaders.map((item)=>{
                return <option className=""></option>
              })
            }
          </select>
        </div>
      )}

      <div className="mt-4 w-full">
        <button
          onClick={handleUpdateUser}
          disabled={loading}
          className={`w-full bg-colorPrimary py-1 rounded-md text-white oultine-none ${
            loading ? "animate-pulse" : ""
          }`}
        >
          {loading ? "Updating.. wait" : "Update now"}
        </button>
      </div>
    </div>
  );
};

export default EdituserForm;
