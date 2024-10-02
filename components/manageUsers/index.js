"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import Toggle from "../utills/Toggle";
import Modal from "../utills/Modal";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import AdduserForm from "./addUserForm";
import EdituserForm from "./edituserForm";
import EdituserPermissions from "./editUserPermissions";
import { camelToTitle } from "../utills/commonFunctions";
import CustomTable from "../utills/customTable";

const ManageUsers = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilterdData] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
  const [selectedUserToEditPermissions, setSelectedUserToEditPermissions] =
    useState(false);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/getAllUsers`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setLoading(false);
      if (data.users) {
        return data?.users;
      } else {
        return null;
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.log("error in getting roles", error.message);
      return null;
    }
  };

  const { data: allUsers, refetch: refetchUsers } = useQuery({
    queryKey: "allUsers",
    queryFn: getAllUsers,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (searchTerm == "") {
      return setFilterdData(allUsers);
    }

    let filteredData = allUsers?.filter(
      (item) =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilterdData(filteredData);
  }, [searchTerm, allUsers]);

  const handleIsActive = async (isActiveNow, email) => {
    try {
      let token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/updateUser`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ email: email, isActive: !isActiveNow }),
      });

      const response = await res.json();
      if (response.success) {
        toast.success(response.message);
        refetchUsers();
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = useMemo(() => {
    let cols = [
      "name",
      "email",
      "department",
      "hierarchy",
      "leaderName",
      "active",
      "password",
      "createdAt",
      "edit",
    ];
    return cols.map((key) => {
      if (key == "createdAt") {
        return {
          Header: key,
          accessor: key,
          Cell: ({ value }) => {
            return (
              value && (
                <p>{new Date(value?._seconds * 1000)?.toLocaleDateString()}</p>
              )
            );
          },
          sortType: (rowA, rowB, columnId) => {
            const dateA = rowA.values[columnId]?._seconds
              ? new Date(rowA.values[columnId]?._seconds * 1000)
              : null;
            const dateB = rowB.values[columnId]?._seconds
              ? new Date(rowB.values[columnId]?._seconds * 1000)
              : null;

            if (!dateA && !dateB) return 0; // Both dates are missing
            if (!dateA) return 1; // dateA is missing, place it after dateB
            if (!dateB) return -1; // dateB is missing, place it after dateA

            return dateA > dateB ? 1 : -1; // Compare valid dates
          },
          id: key,
        };
      }

      if (key == "active") {
        return {
          Header: "Active",
          accessor: "isActive",
          Cell: ({ value, row }) => (
            <div className="p-2">
              <Toggle
                toggle={value ? true : false}
                handleClick={() => handleIsActive(value, row.original.email)}
              />
            </div>
          ),
        };
      }
      if (key == "edit") {
        return {
          Header: "Edit",
          Cell: ({ value, row }) => (
            <div className="flex justify-center items-center gap-4 ">
              <CiEdit
                onClick={() => setSelectedUserToEdit(row.original)}
                className="text-xl text-slate-600 cursor-pointer hover:text-colorPrimary"
              />

              {/* <button
                onClick={() => setSelectedUserToEditPermissions(row.original)}
                className="text-white bg-colorPrimary py-1 px-3 rounded-md"
              >
                Permissions
              </button> */}
            </div>
          ),
        };
      }

      return {
        Header: camelToTitle(key),
        accessor: key,
        id: key,
      };
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <img src="/loader.gif" className="h-[60px] w-auto" alt="loading" />
        <p className="text-xl font-bold text-gray-500 mt-3">
          Loading... please wait
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-2">
      {showAddUserModal && (
        <Modal>
          <div className="min-w-[30vw] p-4 relative bg-white rounded-md">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="text-white p-1 bg-red-500 absolute top-0 right-0"
            >
              Close
            </button>

            <AdduserForm
              close={() => setShowAddUserModal(false)}
              refetchUsers={refetchUsers}
              allUsers={allUsers}
            />
          </div>
        </Modal>
      )}
      {selectedUserToEdit && (
        <Modal>
          <div className="min-w-[30vw] p-4 relative bg-white rounded-md">
            <button
              onClick={() => setSelectedUserToEdit(false)}
              className="text-white p-1 bg-red-500 absolute top-0 right-0"
            >
              Close
            </button>

            <EdituserForm
              close={() => setSelectedUserToEdit(false)}
              refetchUsers={refetchUsers}
              currentUser={selectedUserToEdit}
              allUsers={allUsers}
            />
          </div>
        </Modal>
      )}
      {selectedUserToEditPermissions && (
        <Modal>
          <div className="w-[90vw] md:w-[60vw] lg:w-[50vw] h-[80vh] p-4 relative bg-white rounded-md">
            <button
              onClick={() => setSelectedUserToEditPermissions(null)}
              className="text-white p-1 bg-red-500 absolute top-0 right-0"
            >
              Close
            </button>

            <EdituserPermissions
              close={() => setSelectedUserToEditPermissions(null)}
              refetchUsers={refetchUsers}
              currentUser={selectedUserToEditPermissions}
            />
          </div>
        </Modal>
      )}

      {/* <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name, email, or role"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => setShowAddUserModal(true)}
            className="text-white bg-colorPrimary py-1 px-3 rounded-md"
          >
            Add user
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Manager</th>
                <th className="px-4 py-2 border">Active</th>
                <th className="px-4 py-2 border">Password</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Edit user</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border">{item.email}</td>
                  <td className="px-4 py-2 border">{item.role}</td>
                  <td className="px-4 py-2 border">{item.managerName}</td>
                  <td className="px-4 py-2 border">
                    <Toggle
                      toggle={item?.isActive ? true : false}
                      handleClick={() =>
                        handleIsActive(item.isActive, item.email)
                      }
                    />
                  </td>
                  <td className="px-4 py-2 border">{item.password}</td>
                  <td className="px-4 py-2 border">
                    {new Date(
                      item.createdAt?._seconds * 1000
                    ).toLocaleDateString() || "N/A"}
                  </td>
                  <td className="px-4 py-2 border flex items-center justify-center gap-3">
                    <CiEdit
                      onClick={() => setSelectedUserToEdit(item)}
                      className="text-xl text-slate-600 cursor-pointer hover:text-colorPrimary"
                    />

                    <button
                      onClick={() => setSelectedUserToEditPermissions(item)}
                      className="text-white bg-colorPrimary py-1 px-3 rounded-md"
                    >
                      Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name, email, or role"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => setShowAddUserModal(true)}
          className="text-white bg-colorPrimary py-1 px-3 rounded-md"
        >
          Add user
        </button>
      </div>

      <CustomTable
        data={filteredData || []}
        uniqueDataKey={"email"}
        selectedRows={[]}
        setSelectedRows={() => {}}
        columns={columns}
        // openModal={openModal}
        // closeModal={() => setOpenModal(false)}
      />
    </div>
  );
};

export default ManageUsers;
