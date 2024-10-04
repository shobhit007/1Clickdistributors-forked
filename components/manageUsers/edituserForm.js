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
    leader: "",
  });
  const [loading, setLoading] = useState(false);
  const [allLeaders, setAllLeaders] = useState(null);
  useEffect(() => {
    if (currentUser) {
      setData({
        name: currentUser.name,
        password: currentUser.password,
        phone: currentUser.phone,
        department: currentUser.department,
        hierarchy: currentUser.hierarchy,
        leader: currentUser.leader,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    let leaders = allUsers.filter((item) => item?.hierarchy == "teamLead");
    setAllLeaders(leaders);
  }, [allUsers]);

  const handleInputChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
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
    if (!data?.department || data.department == "") {
      return toast.error("Choose department of user");
    }
    if (!data?.hierarchy || data.hierarchy == "") {
      return toast.error("Choose hierarchy of user");
    }

    if (
      data?.department == "sales" &&
      data?.hierarchy == "member" &&
      (!data.leader || data.leader == "")
    ) {
      return toast.error("Choose leader of user");
    }

    try {
      setLoading(true);
      let body = { ...data };
      delete body.leaderName;
      if (body?.hierarchy != "member") {
        delete body.leader;
        delete body.leaderName;
      }

      // return console.log("body is", body);
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
            <option>Select Leader</option>
            {allLeaders?.map((item) => {
              return (
                <option className="" value={item.id}>
                  {item.name}
                </option>
              );
            })}
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
