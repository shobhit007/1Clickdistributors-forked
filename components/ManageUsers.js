// import { useQuery } from "@tanstack/react-query";
// import React, { useEffect, useState } from "react";
// import Toggle from "./utills/Toggle";
import TestComponent from "./TestComponent";

// const ManageUsers = () => {
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredData, setFilterdData] = useState([]);

//   const getAllUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("authToken");
//       let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/getAllUsers`;
//       const response = await fetch(API_URL, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       setLoading(false);
//       console.log("data in func ", data);
//       if (data.users) {
//         return data?.users;
//       } else {
//         return null;
//       }
//     } catch (error) {
//       setLoading(false);
//       toast.error(error.message);
//       console.log("error in getting roles", error.message);
//       return null;
//     }
//   };

//   const {
//     data: allUsers,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: "allUsers",
//     queryFn: getAllUsers,
//     refetchOnWindowFocus: false,
//     retry: false,
//     staleTime: Infinity,
//   });

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   useEffect(() => {
//     if (searchTerm == "") {
//       return setFilterdData(allUsers);
//     }

//     let filteredData = allUsers?.filter(
//       (item) =>
//         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.role.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilterdData(filteredData);
//   }, [searchTerm, allUsers]);

//   const handleIsActive = (isActiveNow) => {
//     console.log("is acive", isActiveNow);
//   };

//   if (loading) {
//     return (
//       <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
//         <img src="/loader.gif" className="h-[60px] w-auto" alt="loading" />
//         <p className="text-xl font-bold text-gray-500 mt-3">
//           Loading... please wait
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full mt-2">
//       <div className="p-6">
//         <div className="mb-4 flex items-center gap-3">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={handleSearch}
//             placeholder="Search by name, email, or role"
//             className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <button className="text-white bg-colorPrimary py-1 px-3 rounded-md">
//             Add user
//           </button>
//           <TestComponent />
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border-collapse border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="px-4 py-2 border">Name</th>
//                 <th className="px-4 py-2 border">Email</th>
//                 <th className="px-4 py-2 border">Role</th>
//                 <th className="px-4 py-2 border">Active</th>
//                 <th className="px-4 py-2 border">Password</th>
//                 <th className="px-4 py-2 border">Created At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData?.map((item, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border">{item.name}</td>
//                   <td className="px-4 py-2 border">{item.email}</td>
//                   <td className="px-4 py-2 border">{item.role}</td>
//                   <td className="px-4 py-2 border">
//                     <Toggle
//                       toggle={item?.isActive ? true : false}
//                       handleClick={() => handleIsActive(item.isActive)}
//                     />
//                   </td>
//                   <td className="px-4 py-2 border">{item.password}</td>
//                   <td className="px-4 py-2 border">
//                     {new Date(
//                       item.createdAt?._seconds * 1000
//                     ).toLocaleDateString() || "N/A"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageUsers;

import React from "react";

const ManageUsers = () => {
  return (
    <div>
      ManageUsers <TestComponent />{" "}
    </div>
  );
};

export default ManageUsers;
