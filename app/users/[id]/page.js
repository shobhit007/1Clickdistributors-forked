"use client";
import { logout } from "@/store/auth/authReducer";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

const UserProfile = ({ params }) => {
  // Access the dynamic route parameters using the `params` object
  const router = useRouter();
  const { id } = params;

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("authToken");
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {id}</p>

      <button
        onClick={handleLogout}
        className="text-white bg-red-500 p-3 rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
